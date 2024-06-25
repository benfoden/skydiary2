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
  const defaults =
    "flex items-center justify-between px-4 py-2 gap-4 rounded-full text-decoration-none transition ";
  const sharedColors =
    "bg-white/40 dark:bg-white/[.12] hover:bg-white/80 hover:dark:bg-white/[.24]";

  switch (variant) {
    case "primary":
      buttonClass += defaults + sharedColors;
      break;
    case "text":
      buttonClass += defaults + "hover:bg-white/80 dark:hover:bg-white/[.24]";
      break;
    case "menuElement":
      buttonClass +=
        " flex px-6 py-3 sm:px-4 sm:py-2 items-center justify-between gap-4 w-full rounded text-decoration-none transition hover:dark:bg-white/[.24] hover:bg-white/80";
      break;
    case "cta":
      buttonClass +=
        " flex px-6 py-3 sm:px-4 sm:py-2 items-center justify-between gap-4 rounded-full text-decoration-none  transition bg-white/80 hover:bg-white dark:bg-white/[.18] dark:hover:bg-white/[.36]";
      break;
    case "chip":
      buttonClass +=
        " flex px-2 py-1 w-fit items-center justify-between gap-4 rounded-full text-decoration-none transition text-xs font-medium bg-white/30 dark:bg-white/[.08] hover:bg-white/60 dark:hover:bg-white/[.16]";
      break;
    case "submit":
      buttonClass +=
        " mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/80 px-4 transition text-decoration-none hover:bg-white/90 active:bg-white dark:bg-white/[.16] dark:hover:bg-white/[.32] dark:active:bg-white/[.35]";
      break;
    default:
      buttonClass += defaults + sharedColors;
      break;
  }

  if (isDisabled) {
    buttonClass += " animate-pulse opacity-60";
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
