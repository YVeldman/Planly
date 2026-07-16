"use client";

import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";

type ImportedRecipe = {
  title: string | null;
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
};

export function RecipeImportField({ onImported }: { onImported: (recipe: ImportedRecipe) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recipe-import?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kon dit recept niet ophalen.");
        return;
      }
      onImported(data);
    } catch {
      setError("Kon dit recept niet ophalen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-sage-300 bg-sage-50/50 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-500">
        <Link2 className="h-3.5 w-3.5" /> Recept importeren via link
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Plak een link naar een recept (bijv. Allerhande, 24Kitchen)"
          className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
        <button
          type="button"
          disabled={loading || !url.trim()}
          onClick={handleImport}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-sage-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {loading ? "Bezig..." : "Ophalen"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-[#a35b36]">{error}</p>}
    </div>
  );
}
