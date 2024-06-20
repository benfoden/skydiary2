import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n-config";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ja|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
