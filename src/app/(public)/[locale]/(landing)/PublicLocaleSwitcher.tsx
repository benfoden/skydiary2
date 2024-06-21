"use client";

import { useLocale } from "next-intl";
import { type Locales } from "~/config";
import { Link, usePathname } from "../../../../navigation.public";
import Button from "../../../_components/Button";

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
  console.log("locale", locale, useLocale());

  return (
    <Link
      className={isActive ? "underline" : ""}
      href={isActive ? "/" : pathname}
      locale={locale}
    >
      <Button variant="chip">{locale.toUpperCase()}</Button>
    </Link>
  );
}
