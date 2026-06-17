type CurveDividerProps = {
  flip?: boolean;
  /** Tailwind text-color classes (supports dark: variants) used as the fill via currentColor */
  colorClassName?: string;
  className?: string;
};

/**
 * Organic curve used to transition between sections, echoing the reference
 * layout's soft blob shape. Color is driven by `currentColor` so it can
 * respond to dark mode via Tailwind text-color utilities.
 */
export default function CurveDivider({
  flip = false,
  colorClassName = "text-lore-cream dark:text-lore-night",
  className = "",
}: CurveDividerProps) {
  return (
    <div
      className={`pointer-events-none w-full overflow-hidden ${
        flip ? "rotate-180" : ""
      } ${colorClassName} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[60px] w-full sm:h-[90px] md:h-[120px]"
      >
        <path
          fill="currentColor"
          d="M0,40 C240,110 480,0 720,30 C960,60 1200,110 1440,40 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
