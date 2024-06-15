import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";
import { redirects } from "redirectTable";
import { i18nConfig as i18n } from "./src/utils/i18n";

function getLocale(request: NextRequest): string | undefined {
  const negotiationHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiationHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiationHeaders }).languages();
  const locales: string[] = i18n.locales;

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (e) {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectPathname = redirects[pathname as keyof typeof redirects];
  if (redirectPathname) {
    return NextResponse.redirect(new URL(redirectPathname, request.url));
  }
  if (
    i18n.locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}`) ?? pathname === `/${locale}`,
    )
  ) {
    return;
  }
  const locale = getLocale(request) ?? i18n.defaultLocale;

  return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|images|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-*.xml).*)",
  ],
};
