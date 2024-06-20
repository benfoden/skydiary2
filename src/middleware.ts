import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n-config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    "/",
    "/(ja|en)/:path*",
    "/api/auth/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
