/** Skeleton jenerik pou seksyon k ap chaje (Suspense fallback). */
export default function SectionSkeleton({ minHeight = 320 }: { minHeight?: number }) {
  return (
    <div
      style={{ minHeight }}
      className="mx-auto flex w-full max-w-7xl animate-pulse items-center justify-center px-5 py-16 sm:px-8 lg:px-12"
      aria-hidden="true"
    >
      <div className="h-full w-full rounded-3xl bg-lore-dark/[0.03] dark:bg-white/[0.03]" />
    </div>
  );
}
