"use client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function GetCommentButton({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { pending }: { pending: boolean } = useFormStatus();
  return (
    <Button type="submit" disabled={pending ?? isDisabled}>
      {pending || isDisabled ? (
        <ButtonSpinner />
      ) : (
        <ChatBubbleIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
