"use client";

import { useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  return (
    <html>
      <body>
        <h2>{t("error.something wrong")}</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>{t("form.try again")}</button>
      </body>
    </html>
  );
}
