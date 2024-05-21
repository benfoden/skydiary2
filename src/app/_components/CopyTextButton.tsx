"use client";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { copyTextToClipboard } from "~/utils/text";
import Button from "./Button";

export default function CopyTextButton({ text }: { text: string }) {
  const handleCopyText = async (text: string) => {
    try {
      await copyTextToClipboard(text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="menuElement" onClick={() => handleCopyText(text)}>
      Copy all text
      <ClipboardIcon className="h-5 w-5" />
    </Button>
  );
}
