export function Card({
  children,
  isButton = true,
  variant = "default",
}: {
  children: React.ReactNode;
  isButton?: boolean;
  variant?: "default" | "narrow" | "wide";
}) {
  const sharedColors = " bg-white/30 dark:bg-white/[.08]";
  const sharedHover =
    "cursor-pointer transition hover:bg-white/60 hover:dark:bg-white/[.16]";

  const DefaultCard = () => (
    <div
      className={
        `w-full min-w-64 rounded-xl px-8 py-2 ${isButton && sharedHover}` +
        sharedColors
      }
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
          className={
            `w-64 rounded-xl  px-4 py-2 ${isButton && sharedHover}` +
            sharedColors
          }
        >
          <div className="flex items-center gap-2">{children}</div>
        </div>
      );
    case "wide":
      return (
        <div
          className={
            `w-full min-w-[512px] rounded-xl px-8 py-2 ${isButton && sharedHover}` +
            sharedColors
          }
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
