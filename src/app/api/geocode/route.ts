import { NextResponse } from "next/server";

// Nominatim's display_name is the full address hierarchy (neighbourhood, district,
// county, country, ...). We only want street + house number, postcode and city.
function shortLabel(result: { display_name: string; address?: Record<string, string> }): string {
  const address = result.address;
  if (!address) return result.display_name;

  const street = [address.road, address.house_number].filter(Boolean).join(" ");
  const city = address.city || address.town || address.village || address.municipality;
  const cityLine = [address.postcode, city].filter(Boolean).join(" ");

  const label = [street, cityLine].filter(Boolean).join(", ");
  return label || result.display_name;
}

// Proxies address search to OpenStreetMap's Nominatim service so the API key-free
// client never talks to a third party directly and always sends a valid User-Agent,
// per Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "5");
    url.searchParams.set("accept-language", "nl");
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Planly-FamilyPlanner/1.0 (family calendar app)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const results: Array<{ display_name: string; address?: Record<string, string> }> = await response.json();
    const labels = results.map((r) => shortLabel(r));

    return NextResponse.json(labels);
  } catch {
    return NextResponse.json([]);
  }
}
