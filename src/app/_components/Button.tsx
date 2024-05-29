"use client";
import { useFormStatus } from "react-dom";

export default function Button({
  variant = "primary",
  children,
  ...props
}: {
  variant?: "primary" | "text" | "menuElement" | "cta" | "chip" | "submit";
  isServerSideForm?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let isDisabled = props.disabled;
  const { pending }: { pending: boolean } = useFormStatus();
  if (isDisabled === undefined) {
    isDisabled = pending;
  }

  let buttonClass = "";
  const defaultButton =
    " flex items-center justify-between px-4 py-2 gap-4 rounded-full bg-white/30 no-underline transition hover:bg-white/60";
  switch (variant) {
    case "primary":
      buttonClass += defaultButton;
      break;
    case "text":
      buttonClass +=
        " flex items-center justify-between px-4 py-2 rounded-full text-decoration-none no-underline transition text-primary hover:bg-white/60";
      break;
    case "menuElement":
      buttonClass +=
        " flex px-6 py-3 sm:px-4 sm:py-2 items-center justify-between gap-4 w-full rounded text-decoration-none no-underline transition text-primary hover:bg-white/60";
      break;
    case "cta":
      buttonClass +=
        " flex px-6 py-3 sm:px-4 sm:py-2 items-center justify-between gap-4 rounded-full text-decoration-none no-underline transition text-primary bg-white/80 hover:bg-white";
      break;
    case "chip":
      buttonClass +=
        " flex px-2 py-1 items-center justify-between gap-4 rounded-full text-decoration-none no-underline transition text-xs font-medium bg-white/40 hover:bg-white/60";
      break;
    case "submit":
      buttonClass +=
        " mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/70 px-4 text-base transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#424245] focus:ring-offset-2";
      break;
    default:
      buttonClass += defaultButton;
      break;
  }

  if (isDisabled) {
    buttonClass += " animate-pulse opacity-50";
  }

  return (
    <button
      className={buttonClass}
      disabled={isDisabled}
      type={variant === "submit" ? "submit" : "button"}
      {...props}
    >
      {children}
    </button>
  );
}
