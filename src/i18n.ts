/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locales } from "./i18n-config";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locales)) notFound();

  return {
    messages: (
      await (locale === "en"
        ? import("../messages/en.json")
        : import(`../messages/${locale}.json`))
    ).default,
  };
});
