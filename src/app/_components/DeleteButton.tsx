"use client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function DeleteButton() {
  const { pending }: { pending: boolean } = useFormStatus();
  return (
    <Button variant="menuElement" type="submit" disabled={pending}>
      {pending ? (
        <>
          deleting...
          <ButtonSpinner />
        </>
      ) : (
        <>
          delete <Cross1Icon className="h-5 w-5" />
        </>
      )}
    </Button>
  );
}
