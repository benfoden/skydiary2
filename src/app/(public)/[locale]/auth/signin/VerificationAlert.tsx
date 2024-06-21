"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function VerificationAlert() {
  const t = useTranslations();
  const ERROR_MESSAGES = {
    Configuration: t("error.configuration.message"),
    AccessDenied: t("error.accessdenied.message"),
    Verification: t("error.verification.message"),
    Default: t("error.default.message"),
  };

  const params = useSearchParams();
  const error = params.get("error") as keyof typeof ERROR_MESSAGES;

  return error ? (
    <div className="mb-3 border-l-4 border-red-400 bg-red-50 p-4 text-sm text-red-700">
      {ERROR_MESSAGES[error] || ERROR_MESSAGES.Default}
    </div>
  ) : null;
}
