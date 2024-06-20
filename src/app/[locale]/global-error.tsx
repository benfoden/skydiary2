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
        <h1>{t("error.somethingwrong.heading")}</h1>
        <p>{error.message}</p>
        <button onClick={() => reset()}>{t("form.try again")}</button>
      </body>
    </html>
  );
}
