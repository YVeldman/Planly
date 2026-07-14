"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export function LocationInput({
  defaultValue = "",
  placeholder = "Locatie (bijv. Tandartspraktijk, Hoofdstraat 12)",
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (next.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(next)}`);
        const data: string[] = res.ok ? await res.json() : [];
        if (requestId === requestIdRef.current) {
          setSuggestions(data);
          setOpen(data.length > 0);
        }
      } catch {
        // Network hiccup: stay a plain free-text field, nothing to show.
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }, 350);
  }

  function selectSuggestion(label: string) {
    setValue(label);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          name="location"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-lg border border-sage-200 py-2 pl-9 pr-8 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-400" />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-sage-200 bg-white shadow-lg">
          {suggestions.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => selectSuggestion(label)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-ink-900 hover:bg-sage-50"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
                <span className="truncate">{label}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-sage-100 px-3 py-1.5 text-[10px] text-ink-400">
            Locaties via OpenStreetMap
          </li>
        </ul>
      )}
    </div>
  );
}
