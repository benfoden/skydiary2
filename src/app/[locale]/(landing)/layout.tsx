import "~/styles/globals.css";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Button from "~/app/_components/Button";
import { getServerAuthSession } from "~/server/auth";

export async function Nav() {
  const session = await getServerAuthSession();
  const t = await getTranslations();

  return (
    <nav className="flex w-full items-center justify-between bg-transparent p-4 text-[#424245]">
      <div className="flex items-center">
        <h1>
          <Link
            href="/"
            className=" rounded-full px-4 py-2 text-xl font-light no-underline"
            aria-label="skydiary logo"
          >
            skydiary
          </Link>
        </h1>
        <Link
          href="/about"
          className="rounded-full px-4 py-2 no-underline transition hover:bg-white/30"
        >
          {t("nav.about")}
        </Link>
      </div>
      <div className="flex items-center">
        {!session && (
          <Link
            href={session ? "/home" : "/auth/signin"}
            className="text-nowrap rounded-full px-4 py-2 no-underline transition hover:bg-white/50"
          >
            {t("nav.login")}
          </Link>
        )}
        <Link href={session ? "/home" : "/auth/signin"}>
          <Button>
            <span className="text-nowrap">
              {session ? t("nav.home") : t("nav.signup")}
            </span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
