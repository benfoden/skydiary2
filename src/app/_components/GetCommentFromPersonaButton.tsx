"use client";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function GetCommentButton({
  isDisabled,
  personaName,
}: {
  isDisabled: boolean;
  personaName: string;
}) {
  const { pending }: { pending: boolean } = useFormStatus();
  return (
    <Button type="submit" disabled={pending ?? isDisabled}>
      {pending || isDisabled ? <ButtonSpinner /> : <>{personaName}</>}
    </Button>
  );
}
