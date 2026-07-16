import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import type { LookupAddress } from "node:dns";

export type ImportedRecipe = {
  title: string | null;
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
};

const MAX_REDIRECTS = 5;
const MAX_BYTES = 3 * 1024 * 1024; // 3MB is plenty for an HTML recipe page
const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT = "Planly-FamilyPlanner/1.0 (recipe import; family calendar app)";

// Blocks SSRF: a user-supplied URL must never let the server reach internal
// infrastructure (localhost, cloud metadata endpoints, LAN devices, etc).
function isPrivateAddress(address: string): boolean {
  const ip = address.toLowerCase();

  if (ip === "::1" || ip === "0.0.0.0") return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true; // fc00::/7 unique local
  if (/^fe[89ab][0-9a-f]:/.test(ip)) return true; // fe80::/10 link-local
  if (ip.startsWith("::ffff:")) return isPrivateAddress(ip.slice(7));

  const ipv4Match = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4Match) return false;

  const [a, b] = [Number(ipv4Match[1]), Number(ipv4Match[2])];
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  return false;
}

// Resolves the hostname once and returns a single vetted address. Connecting to
// this pinned address (instead of letting the HTTP client re-resolve the
// hostname) is what prevents a DNS-rebinding SSRF bypass, where a malicious
// name server would answer the validation lookup with a public IP and a later
// lookup - made during the actual connection - with a private one.
async function resolvePinnedAddress(hostname: string): Promise<LookupAddress> {
  if (hostname === "localhost") {
    throw new Error("Deze locatie is niet toegestaan.");
  }

  const records = await dns.lookup(hostname, { all: true });
  if (records.length === 0) {
    throw new Error("Kon deze locatie niet vinden.");
  }
  for (const record of records) {
    if (isPrivateAddress(record.address)) {
      throw new Error("Deze locatie is niet toegestaan.");
    }
  }
  return records[0];
}

function requestOnce(
  url: URL,
  pinned: LookupAddress
): Promise<{ status: number; location: string | null; body: string }> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;

    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html", Host: url.hostname },
        // Pin the connection to the pre-validated IP instead of re-resolving the hostname.
        // Node's default happy-eyeballs connect path always calls this with `all: true`
        // and expects the array form of the callback, so always answer with one.
        lookup: (_hostname, _options, callback) => {
          callback(null, [{ address: pinned.address, family: pinned.family }]);
        },
        timeout: FETCH_TIMEOUT_MS,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location ?? null;

        let total = 0;
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => {
          total += chunk.byteLength;
          if (total > MAX_BYTES) {
            res.destroy();
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => resolve({ status, location, body: Buffer.concat(chunks).toString("utf-8") }));
        res.on("error", reject);
      }
    );

    req.on("timeout", () => req.destroy(new Error("Timeout bij ophalen van de pagina.")));
    req.on("error", reject);
    req.end();
  });
}

async function fetchHtml(startUrl: string): Promise<string> {
  let current = new URL(startUrl);

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    if (current.protocol !== "http:" && current.protocol !== "https:") {
      throw new Error("Alleen http(s) links worden ondersteund.");
    }

    const pinned = await resolvePinnedAddress(current.hostname);
    const response = await requestOnce(current, pinned);

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (!response.location) throw new Error("Kon de link niet volgen.");
      current = new URL(response.location, current);
      continue;
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Kon deze pagina niet ophalen.");
    }

    return response.body;
  }

  throw new Error("Te veel doorverwijzingen.");
}

type JsonLdNode = Record<string, unknown>;

function flattenJsonLd(parsed: unknown): JsonLdNode[] {
  if (Array.isArray(parsed)) return parsed.flatMap(flattenJsonLd);
  if (parsed && typeof parsed === "object") {
    const node = parsed as JsonLdNode;
    const graph = node["@graph"];
    if (Array.isArray(graph)) return graph.flatMap(flattenJsonLd);
    return [node];
  }
  return [];
}

function isRecipeNode(node: JsonLdNode): boolean {
  const type = node["@type"];
  if (typeof type === "string") return type === "Recipe";
  if (Array.isArray(type)) return type.includes("Recipe");
  return false;
}

function extractRecipeNode(html: string): JsonLdNode | null {
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html))) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const nodes = flattenJsonLd(parsed);
      const recipe = nodes.find(isRecipeNode);
      if (recipe) return recipe;
    } catch {
      // Not valid JSON (or not the block we want) - try the next script tag.
    }
  }

  return null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(text: string): string {
  return decodeEntities(text.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImage(image: unknown): string | null {
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return normalizeImage(image[0]);
  if (image && typeof image === "object" && "url" in image) {
    return normalizeImage((image as { url: unknown }).url);
  }
  return null;
}

function normalizeIngredients(ingredients: unknown): string[] {
  if (!Array.isArray(ingredients)) return [];
  return ingredients
    .filter((i): i is string => typeof i === "string")
    .map((i) => stripHtml(i))
    .filter(Boolean);
}

function flattenInstructions(value: unknown): string[] {
  if (typeof value === "string") {
    return stripHtml(value)
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) return value.flatMap(flattenInstructions);
  if (value && typeof value === "object") {
    const node = value as JsonLdNode;
    if (typeof node.text === "string") return [stripHtml(node.text)];
    if (Array.isArray(node.itemListElement)) return flattenInstructions(node.itemListElement);
    if (typeof node.name === "string") return [stripHtml(node.name)];
  }
  return [];
}

function normalizeInstructions(instructions: unknown): string[] {
  return flattenInstructions(instructions).filter(Boolean);
}

function parseIsoDurationToMinutes(duration: unknown): number | null {
  if (typeof duration !== "string") return null;
  const match = duration.match(/^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?$/i);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const total = hours * 60 + minutes;
  return total > 0 ? total : null;
}

export async function importRecipeFromUrl(rawUrl: string): Promise<ImportedRecipe> {
  const url = new URL(rawUrl);
  const html = await fetchHtml(url.toString());
  const recipe = extractRecipeNode(html);

  if (!recipe) {
    throw new Error("Geen recept gevonden op deze pagina.");
  }

  const title = typeof recipe.name === "string" ? stripHtml(recipe.name) : null;
  const imageUrl = normalizeImage(recipe.image);
  const ingredients = normalizeIngredients(recipe.recipeIngredient ?? recipe.ingredients);
  const instructions = normalizeInstructions(recipe.recipeInstructions);
  const prepTimeMinutes =
    parseIsoDurationToMinutes(recipe.totalTime) ??
    parseIsoDurationToMinutes(recipe.cookTime) ??
    parseIsoDurationToMinutes(recipe.prepTime);

  return {
    title,
    imageUrl,
    prepTimeMinutes,
    ingredients,
    instructions,
    sourceUrl: url.toString(),
  };
}
