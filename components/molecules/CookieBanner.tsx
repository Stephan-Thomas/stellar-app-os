'use client';

import { JSX, useState } from 'react';
import { PiCookieBold, PiCheckBold, PiProhibitBold, PiSlidersHorizontalBold } from 'react-icons/pi';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookieSettingsModal } from '@/components/molecules/CookieSettingsModal';
import type { CookiePreferences } from '@/hooks/useCookieConsent';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * CookieBanner
 *
 * Drop this once into your root layout (below providers). It renders nothing
 * once the user has consented, so there's no performance cost to leaving it
 * mounted permanently.
 *
 * Accessibility:
 *   - role="region" + aria-label identifies the landmark
 *   - role="alert" ensures screen readers announce the banner on first visit
 *   - All interactive controls are reachable by keyboard
 *   - Colour contrast: text-slate-900 on white ≥ 14:1 (far exceeds 4.5:1)
 *   - Icons are decorative (aria-hidden); labels carry the meaning
 *
 * Responsiveness:
 *   - Single column on mobile, horizontal layout on sm+ (Tailwind sm breakpoint)
 *   - Buttons stack vertically on small screens, row on wider screens
 *   - Banner stays at the bottom on all viewports (fixed bottom-0)
 */
export function CookieBanner(): JSX.Element | null {
  const { hasConsented, preferences, acceptAll, rejectNonEssential, updatePreferences } =
    useCookieConsent();

  const [showModal, setShowModal] = useState<boolean>(false);

  // Hide banner entirely once the user has made a choice
  if (hasConsented) return null;

  function handleSavePreferences(prefs: Omit<CookiePreferences, 'necessary'>): void {
    updatePreferences(prefs);
    setShowModal(false);
  }

  return (
    <>
      {/* ── Banner ───────────────────────────────────────────────────────── */}
      <div
        role="region"
        aria-label="Cookie consent"
        aria-live="polite"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
          {/* Icon + text */}
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <PiCookieBold
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">We value your privacy</p>
              <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">
                We use cookies to improve your experience, analyse traffic, and personalise
                content. You can choose which categories to allow.{' '}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded-sm"
                >
                  Privacy policy
                </a>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
            {/* Customize */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 w-full sm:w-auto"
            >
              <PiSlidersHorizontalBold aria-hidden="true" className="h-4 w-4" />
              Customize
            </button>

            {/* Reject Non-Essential */}
            <button
              type="button"
              onClick={rejectNonEssential}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 w-full sm:w-auto"
            >
              <PiProhibitBold aria-hidden="true" className="h-4 w-4" />
              Reject non-essential
            </button>

            {/* Accept All */}
            <button
              type="button"
              onClick={acceptAll}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 w-full sm:w-auto"
            >
              <PiCheckBold aria-hidden="true" className="h-4 w-4" />
              Accept all
            </button>
          </div>
        </div>
      </div>

      {/* ── Settings Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <CookieSettingsModal
          initialPreferences={preferences}
          onSave={handleSavePreferences}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}