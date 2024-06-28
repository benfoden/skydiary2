"use client";

import { useTranslations } from "next-intl";
import { Card } from "./_components/Card";

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
        <div className="w=full flex h-full flex-col items-center justify-center">
          <Card>
            <h1>{t("error.somethingwrong.heading")}</h1>
            <p>{error.message}</p>
            <button onClick={() => reset()}>{t("form.try again")}</button>
          </Card>
        </div>
      </body>
    </html>
  );
}
