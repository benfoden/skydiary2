export default function Button({
  variant = "primary",
  children,
}: {
  variant?: "primary" | "text";
  children: React.ReactNode;
}) {
  let buttonClass = "rounded-full";
  const defaultButton =
    " bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60";
  switch (variant) {
    case "primary":
      buttonClass += defaultButton;
      break;
    case "text":
      buttonClass += " text-decoration-none no-underline text-primary";
      break;
    default:
      buttonClass += defaultButton;
      break;
  }

  return <button className={buttonClass}>{children}</button>;
}
