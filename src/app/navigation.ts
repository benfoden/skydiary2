import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { localePrefix, locales, pathnames } from "../i18n-config";

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix,
  });
