// Developed by @Alirewa — https://github.com/Alirewa
'use client';

/**
 * Minimal branded loading skeleton shown while the client-side app hydrates.
 * Used as the `loading` fallback for dynamic(ssr: false) imports.
 */
export function AppShell() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#080f1e]"
      aria-label="در حال بارگذاری…"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated brand logo */}
        <div className="size-14 rounded-2xl bg-gradient-to-br from-[#6172f3] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-[#6172f3]/30">
          <svg viewBox="0 0 24 24" fill="none" className="size-7 text-white" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>

        {/* Spinner ring */}
        <svg className="animate-spin size-6 text-[#6172f3]/60" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="50" strokeDashoffset="38" />
        </svg>

        <p className="text-[#6172f3]/70 text-sm font-medium" dir="rtl">
          در حال بارگذاری…
        </p>
      </div>
    </div>
  );
}
