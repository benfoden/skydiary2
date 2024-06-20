"use client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import Button from "./Button";
import ButtonSpinner from "./ButtonSpinner";

export default function DeleteButton() {
  const { pending }: { pending: boolean } = useFormStatus();
  const t = useTranslations();

  return (
    <Button variant="menuElement" type="submit" disabled={pending}>
      {pending ? (
        <>
          {t("status.deleting")}
          <ButtonSpinner />
        </>
      ) : (
        <>
          {t("form.delete")} <Cross1Icon className="h-5 w-5" />
        </>
      )}
    </Button>
  );
}
