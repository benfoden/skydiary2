import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { NavLeft } from "./nav-left";

export async function Nav() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full items-center justify-between bg-transparent p-4 text-[#424245]">
      <div className="flex items-center gap-2">
        {session ? (
          <NavLeft />
        ) : (
          <>
            <h1>
              <Link
                href="/"
                className=" rounded-full px-4 py-2 font-semibold no-underline"
                style={{
                  background: "radial-gradient(circle, #a9d9fc, transparent)",
                }}
                aria-label="skyary home"
              >
                skyary
              </Link>
            </h1>
            <Link
              href="/about"
              className="rounded-full px-4 py-2 no-underline transition hover:bg-white/30"
            >
              About
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p>{session && <span>user: {session.user?.name}</span>}</p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
        >
          {session ? "sign out" : "sign in"}
        </Link>
      </div>
    </nav>
  );
}
