"use client";

import { useLocale } from "next-intl";
import Button from "~/app/_components/Button";
import { type Locale } from "~/config";
import { usePathname } from "~/navigation.public";

export default function PublicLocaleSwitcher() {
  return (
    <div className="flex gap-3 py-5">
      <LocaleButton locale="en" />
      <LocaleButton locale="ja" />
    </div>
  );
}

function LocaleButton({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isActive = useLocale() === locale;

  return (
    <Button
      disabled={isActive}
      onClick={() => {
        if (isActive) return;
        document.cookie = `NEXT_LOCALE=${locale};`;
        window.location.href = pathname;
      }}
    >
      <span className={`text-xs ${isActive && "underline"}`}>
        {locale.toUpperCase()}
      </span>
    </Button>
  );
}
