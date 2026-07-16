import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { importRecipeFromUrl } from "@/lib/recipeImport";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")?.trim();

  if (!url) {
    return NextResponse.json({ error: "Geen link opgegeven." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Dit is geen geldige link." }, { status: 400 });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Alleen http(s) links worden ondersteund." }, { status: 400 });
  }

  try {
    const recipe = await importRecipeFromUrl(parsedUrl.toString());
    return NextResponse.json(recipe);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kon dit recept niet ophalen.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
