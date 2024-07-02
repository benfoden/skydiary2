"use client";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function FormButton({
  variant = "primary",
  isDisabled,
  children,
  props,
}: {
  variant?: "primary" | "menuElement" | "cta" | "chip" | "text" | "submit";
  isDisabled?: boolean;
  children: React.ReactNode;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const { pending }: { pending: boolean } = useFormStatus();
  return (
    <Button
      {...props}
      variant={variant}
      type="submit"
      disabled={pending || isDisabled}
    >
      {pending ? <ButtonSpinner /> : children}
    </Button>
  );
}
