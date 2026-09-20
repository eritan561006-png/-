import clsx from "clsx";

/** Decorative ruyi-cloud scroll motif, echoing the traditional corner ornaments used on the school site. */
export function CloudMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={clsx("pointer-events-none", className)} fill="none" aria-hidden="true">
      <path
        d="M8 55c-4-10 4-20 14-18 1-11 15-16 22-6 6-9 21-7 23 4 10-4 20 5 17 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 62c8 5 45 5 55-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="14" cy="42" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="88" cy="46" r="1.6" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
