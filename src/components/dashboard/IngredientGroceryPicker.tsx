"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { ShoppingCart } from "lucide-react";

export type IngredientGroceryPickerHandle = {
  getSelected: () => string[];
};

export const IngredientGroceryPicker = forwardRef<IngredientGroceryPickerHandle, { ingredients: string[] }>(
  function IngredientGroceryPicker({ ingredients }, ref) {
    const [enabled, setEnabled] = useState(false);
    const [unchecked, setUnchecked] = useState<Set<string>>(new Set());

    useImperativeHandle(
      ref,
      () => ({
        getSelected: () => (enabled ? ingredients.filter((i) => !unchecked.has(i)) : []),
      }),
      [enabled, unchecked, ingredients]
    );

    if (ingredients.length === 0) return null;

    return (
      <div className="rounded-lg border border-sage-200 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-sage-300"
          />
          <ShoppingCart className="h-4 w-4 text-sage-600" />
          Voeg ingrediënten toe aan boodschappenlijst
        </label>
        {enabled && (
          <div className="mt-2 space-y-1.5 border-t border-sage-100 pt-2">
            <p className="text-xs text-ink-500">Vink aan wat je nog moet halen:</p>
            {ingredients.map((ingredient, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-ink-900">
                <input
                  type="checkbox"
                  checked={!unchecked.has(ingredient)}
                  onChange={(e) => {
                    setUnchecked((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.delete(ingredient);
                      else next.add(ingredient);
                      return next;
                    });
                  }}
                  className="h-3.5 w-3.5 rounded border-sage-300"
                />
                {ingredient}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
);
