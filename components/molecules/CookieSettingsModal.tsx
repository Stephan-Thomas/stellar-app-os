'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { PiCookieBold, PiXBold, PiLockSimpleBold, PiCheckBold } from 'react-icons/pi';
import type { CookiePreferences } from '@/hooks/useCookieConsent';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CategoryMeta {
  key: keyof Omit<CookiePreferences, 'necessary'>;
  label: string;
  description: string;
}

interface CookieSettingsModalProps {
  initialPreferences: CookiePreferences | null;
  onSave: (prefs: Omit<CookiePreferences, 'necessary'>) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'analytics',
    label: 'Analytics',
    description:
      'Help us understand how visitors interact with the site by collecting anonymised usage data.',
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description:
      'Used to deliver advertisements relevant to you and track campaign effectiveness.',
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description:
      'Remember your personalisation choices such as language, region, and display settings.',
  },
];

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

function Toggle({ id, checked, disabled = false, label, onChange }: ToggleProps): JSX.Element {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600',
        disabled
          ? 'cursor-not-allowed bg-emerald-500 opacity-50'
          : checked
            ? 'cursor-pointer bg-emerald-500'
            : 'cursor-pointer bg-slate-300',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

/**
 * CookieSettingsModal
 *
 * Accessibility:
 *   - role="dialog" + aria-modal="true" + aria-labelledby
 *   - Focus trap: Tab/Shift+Tab cycles only within the modal
 *   - Escape closes the modal
 *   - Toggles use role="switch" with aria-checked
 *   - Necessary row shows a lock icon + "Always on" text
 */
export function CookieSettingsModal({
  initialPreferences,
  onSave,
  onClose,
}: CookieSettingsModalProps): JSX.Element {
  const [local, setLocal] = useState<Omit<CookiePreferences, 'necessary'>>({
    analytics: initialPreferences?.analytics ?? false,
    marketing: initialPreferences?.marketing ?? false,
    preferences: initialPreferences?.preferences ?? false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'cookie-settings-title';

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    // Move focus into modal on open
    const firstFocusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        el!.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleToggle(key: keyof typeof local, value: boolean): void {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <PiCookieBold aria-hidden="true" className="h-5 w-5 text-emerald-600" />
            <h2 id={titleId} className="text-base font-semibold text-slate-900">
              Cookie Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie settings"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <PiXBold aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-4">
          <p className="text-sm text-slate-500">
            Choose which cookie categories you allow. You can update these at any time.
          </p>

          {/* Necessary — always on */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-semibold text-slate-800">Strictly Necessary</span>
                <PiLockSimpleBold aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Required for the site to function. Cannot be disabled.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <span className="text-xs font-medium text-emerald-600">Always on</span>
              <Toggle
                id="toggle-necessary"
                checked={true}
                disabled={true}
                label="Strictly necessary cookies — always enabled"
                onChange={() => undefined}
              />
            </div>
          </div>

          {/* Configurable categories */}
          {CATEGORIES.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4"
            >
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`toggle-${key}`}
                  className="block text-sm font-semibold text-slate-800 mb-0.5 cursor-pointer"
                >
                  {label}
                </label>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
              <div className="shrink-0 pt-0.5">
                <Toggle
                  id={`toggle-${key}`}
                  checked={local[key]}
                  label={`${label} cookies`}
                  onChange={(v) => handleToggle(key, v)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(local)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <PiCheckBold aria-hidden="true" className="h-4 w-4" />
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}