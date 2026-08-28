"use client";

import { useEffect, useState, useCallback } from "react";

function useLocalStringList(key: string) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, [key]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next);
      window.localStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  const toggle = useCallback(
    (slug: string) => {
      persist(items.includes(slug) ? items.filter((s) => s !== slug) : [...items, slug]);
    },
    [items, persist]
  );

  const add = useCallback(
    (slug: string, max?: number) => {
      if (items.includes(slug)) return;
      if (max && items.length >= max) return;
      persist([...items, slug]);
    },
    [items, persist]
  );

  const remove = useCallback((slug: string) => persist(items.filter((s) => s !== slug)), [items, persist]);
  const clear = useCallback(() => persist([]), [persist]);

  return { items, hydrated, toggle, add, remove, clear };
}

export function useFavorites() {
  return useLocalStringList("luxestone:favorites");
}

export function useCompare() {
  return useLocalStringList("luxestone:compare");
}
