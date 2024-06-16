import { defaultLocale, locales } from "i18n-config";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales, // Used when no locale matches
  defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ja|en)/:path*"],
};

// import { NextResponse } from "next/server";

// import { match } from "@formatjs/intl-localematcher";
// import Negotiator from "negotiator";

// import { default as defaultLocale, default as locales } from "next.config";

// const headers = { "accept-language": "en-US,en;q=0.5" };
// const languages = new Negotiator({ headers }).languages();
// match(languages, locales, defaultLocale); // -> 'en-US'

// // Get the preferred locale, similar to the above or using a library
// function getLocale(request) {
//   const { acceptLanguage } = request.headers;

//   if (!acceptLanguage) return defaultLocale;

//   const locale = match(acceptLanguage, locales, defaultLocale);

//   return locale || defaultLocale;
// }

// export function middleware(request) {
//   // Check if there is any supported locale in the pathname
//   const { pathname } = request.nextUrl;
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
//   );

//   if (pathnameHasLocale) return;

//   // Redirect if there is no locale
//   const locale = getLocale(request);
//   request.nextUrl.pathname = `/${locale}${pathname}`;
//   // e.g. incoming request is /products
//   // The new URL is now /en-US/products
//   return NextResponse.redirect(request.nextUrl);
// }

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next)
//     "/((?!_next).*)",
//     // Optional: only run on root (/) URL
//     // '/'
//   ],
// };
