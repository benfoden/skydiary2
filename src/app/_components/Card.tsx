export function Card({
  children,
  isButton = true,
  variant = "default",
}: {
  children: React.ReactNode;
  isButton?: boolean;
  variant?: "default" | "narrow" | "wide";
}) {
  const DefaultCard = () => (
    <div
      className={`w-full min-w-64 rounded-xl bg-white/30 px-8 py-2 dark:bg-black/30 ${isButton && "transition hover:bg-white/60 active:bg-white/70 dark:hover:bg-black/60 dark:active:bg-black/70"}`}
    >
      <div className="flex items-center justify-between gap-2">{children}</div>
    </div>
  );

  switch (variant) {
    case "default":
      return <DefaultCard />;

    case "narrow":
      return (
        <div
          className={`w-64 rounded-xl bg-white/30 px-4 py-2 ${isButton && "transition hover:bg-white/60 active:bg-white/70"}`}
        >
          <div className="flex items-center gap-2">{children}</div>
        </div>
      );
    case "wide":
      return (
        <div
          className={`w-full min-w-[512px] rounded-xl bg-white/30 px-8 py-2 ${isButton && "transition hover:bg-white/60 active:bg-white/70"}`}
        >
          <div className="flex items-center justify-between gap-2">
            {children}
          </div>
        </div>
      );
    default:
      return <DefaultCard />;
  }
}
