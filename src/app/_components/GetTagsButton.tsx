"use client";
import { FrameIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function GetTagsButton() {
  const { pending }: { pending: boolean } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <ButtonSpinner /> : <FrameIcon className="h-5 w-5" />}
    </Button>
  );
}
