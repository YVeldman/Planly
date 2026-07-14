import { NextResponse } from "next/server";

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

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Planly-FamilyPlanner/1.0 (family calendar app)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const results: Array<{ display_name: string }> = await response.json();
    const labels = results.map((r) => r.display_name);

    return NextResponse.json(labels);
  } catch {
    return NextResponse.json([]);
  }
}
