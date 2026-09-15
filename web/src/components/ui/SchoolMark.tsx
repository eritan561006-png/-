import clsx from "clsx";

/**
 * Placeholder school emblem. The real crest could not be fetched in this
 * sandbox (outbound access to xndxfz.swu.edu.cn is blocked) — swap the
 * SVG below for the official logo file before shipping.
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
      <circle cx="24" cy="24" r="23" fill="#16305f" stroke="#cda23a" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="19" fill="none" stroke="#cda23a" strokeWidth="0.75" opacity="0.6" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#f5e9c3"
        fontFamily="var(--font-sans)"
      >
        两江
      </text>
    </svg>
  );
}
