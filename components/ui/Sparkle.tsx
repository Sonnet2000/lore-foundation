type SparkleProps = {
  className?: string;
  size?: number;
};

export default function Sparkle({ className = "", size = 24 }: SparkleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`animate-twinkle text-lore-gold ${className}`}
      aria-hidden="true"
    >
      <path d="M12 0c.7 4.6 2.4 8.3 5 10.9 2.6 2.6 6.3 4.3 6.9 5-4.6.7-8.3 2.4-10.9 5C10.4 23.5 8.7 19.8 8 12c-4.6-.7-8.3-2.4-5-5C5.6 4.3 9.3 2.6 12 0Z" />
    </svg>
  );
}
