export function Card({
  children,
  isButton = true,
}: {
  children: React.ReactNode;
  isButton?: boolean;
}) {
  return (
    <div
      className={`w-full min-w-64 rounded-xl bg-white/30 px-8 py-2 ${isButton && "transition hover:bg-white/60 active:bg-white/70"}`}
    >
      <div className="flex items-center justify-between gap-2">{children}</div>
    </div>
  );
}
