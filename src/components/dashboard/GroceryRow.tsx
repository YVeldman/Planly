"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { toggleGroceryItemAction, deleteGroceryItemAction } from "@/lib/actions/groceries";

type GroceryItem = { id: string; name: string; category: string | null; done: boolean };

export function GroceryRow({ item }: { item: GroceryItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 border-b border-sage-100 px-4 py-3 last:border-0">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleGroceryItemAction(item.id, !item.done))}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
          item.done ? "border-sage-500 bg-sage-500" : "border-sage-300 bg-white"
        }`}
        aria-label={item.done ? "Markeer als niet gekocht" : "Markeer als gekocht"}
      >
        {item.done && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${item.done ? "text-ink-500 line-through" : "text-ink-900"}`}>
          {item.name}
        </p>
        <p className="truncate text-xs text-ink-500">{item.category ?? "Zelf toegevoegd"}</p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deleteGroceryItemAction(item.id))}
        className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
        aria-label={`Verwijder ${item.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
