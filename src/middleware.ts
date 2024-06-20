import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n-config";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/api/auth/:path*",
    "/(ja|en)/:path*",
    // "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
