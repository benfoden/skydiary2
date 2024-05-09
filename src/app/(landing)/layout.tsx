import "~/styles/globals.css";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export async function Nav() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/home");
  }

  return (
    <nav className="flex w-full items-center justify-between bg-transparent p-4 text-[#424245]">
      <div className="flex items-center gap-2">
        <h1>
          <Link
            href="/"
            className=" rounded-full px-4 py-2 text-xl font-light no-underline"
            aria-label="skyary home"
          >
            skydiary
          </Link>
        </h1>
        <Link
          href="/about"
          className="rounded-full px-4 py-2 no-underline transition hover:bg-white/30"
        >
          About
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={"/api/auth/signin"}
          className="rounded-full px-4 py-2 no-underline transition hover:bg-white/60"
        >
          sign in
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
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
