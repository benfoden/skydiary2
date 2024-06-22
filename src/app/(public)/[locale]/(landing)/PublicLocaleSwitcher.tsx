"use client";

import { useLocale } from "next-intl";
import { type Locales } from "~/config";
import { Link, usePathname } from "../../../../navigation.public";

export default function PublicLocaleSwitcher() {
  return (
    <div className="flex gap-3 py-5">
      <LocaleLink locale="en" />
      <LocaleLink locale="ja" />
    </div>
  );
}

function LocaleLink({ locale }: { locale: Locales }) {
  const pathname = usePathname();
  const isActive = useLocale() === locale;

  return (
    <Link
      className={isActive ? "underline" : ""}
      href={pathname}
      locale={locale}
    >
      {locale.toUpperCase()}
    </Link>
  );
}
