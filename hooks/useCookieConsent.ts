'use client';

import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CookiePreferences = {
  necessary: true; // always true — cannot be toggled off
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

export type CookieConsentState = {
  /** null = banner not yet answered */
  preferences: CookiePreferences | null;
  /** true once user has made any choice */
  hasConsented: boolean;
  /** Accept all categories */
  acceptAll: () => void;
  /** Allow necessary cookies only */
  rejectNonEssential: () => void;
  /** Persist a custom preference object */
  updatePreferences: (prefs: Omit<CookiePreferences, 'necessary'>) => void;
  /** Reset consent (e.g. for testing or "change my preferences" link) */
  resetConsent: () => void;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'cookie-consent' as const;

const ALL_ACCEPTED: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

const ONLY_NECESSARY: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFromStorage(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Basic shape validation — necessary must be true
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'necessary' in parsed &&
      (parsed as Record<string, unknown>).necessary === true
    ) {
      return parsed as CookiePreferences;
    }
    return null;
  } catch {
    return null;
  }
}

function writeToStorage(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function removeFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useCookieConsent
 *
 * Single source of truth for cookie consent state.
 *
 * On first render it reads localStorage. If a valid consent object exists the
 * banner is suppressed and non-essential scripts can be initialised safely.
 * If not, `preferences` is null and `hasConsented` is false — the banner
 * should render and nothing non-essential should run.
 *
 * Non-essential cookie gating pattern (call this anywhere in the app):
 *
 *   const { preferences } = useCookieConsent();
 *   useEffect(() => {
 *     if (preferences?.analytics) initAnalytics();
 *   }, [preferences?.analytics]);
 */
export function useCookieConsent(): CookieConsentState {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Read persisted consent once on client mount
  useEffect(() => {
    const stored = readFromStorage();
    setPreferences(stored);
    setHydrated(true);
  }, []);

  const persist = useCallback((prefs: CookiePreferences): void => {
    writeToStorage(prefs);
    setPreferences(prefs);
  }, []);

  const acceptAll = useCallback((): void => {
    persist(ALL_ACCEPTED);
  }, [persist]);

  const rejectNonEssential = useCallback((): void => {
    persist(ONLY_NECESSARY);
  }, [persist]);

  const updatePreferences = useCallback(
    (partial: Omit<CookiePreferences, 'necessary'>): void => {
      const prefs: CookiePreferences = { necessary: true, ...partial };
      persist(prefs);
    },
    [persist],
  );

  const resetConsent = useCallback((): void => {
    removeFromStorage();
    setPreferences(null);
  }, []);

  // Before hydration, always treat as "not consented" to avoid SSR mismatch
  return {
    preferences: hydrated ? preferences : null,
    hasConsented: hydrated && preferences !== null,
    acceptAll,
    rejectNonEssential,
    updatePreferences,
    resetConsent,
  };
}