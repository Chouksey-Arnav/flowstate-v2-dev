"use client";

import { useEffect, useState } from "react";

/** Returns true only after the component has mounted on the client.
 * Use this to gate rendering of anything derived from the persisted
 * (localStorage-backed) store, since the server has no localStorage
 * and would otherwise render a mismatched empty state. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
