import clsx from "clsx";

/**
 * Placeholder school emblem, styled after the blue-on-white crest convention
 * used across the Southwest University Affiliated High School site family.
 * The real crest could not be fetched in this sandbox (outbound access to
 * xndxfz.swu.edu.cn is blocked) — swap this SVG for the official logo file
 * before shipping.
 */
export function SchoolMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={clsx("shrink-0", className)}
      role="img"
      aria-label="学校校徽占位"
    >
      <circle cx="24" cy="24" r="23" fill="#ffffff" stroke="#1e40a6" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="19.5" fill="none" stroke="#1e40a6" strokeWidth="0.6" opacity="0.55" />
      <circle cx="24" cy="24" r="16.5" fill="#1e40a6" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="'Noto Serif SC', var(--font-sans)"
      >
        两江
      </text>
      <path
        d="M15.5 27c3 2.2 14 2.2 17 0"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M16.5 31.5c2.5 1.4 12.5 1.4 15 0"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}
