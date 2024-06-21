import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n-config";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/api/auth/:path*",
    "/(ja|en)/:path*",
    "/((?!_next|.*\\..*).*)",
  ],
};
