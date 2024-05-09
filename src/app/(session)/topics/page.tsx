import Link from "next/link";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";

export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  return (
    <>
      <SessionNav>
        <div />
        <div>
          <h1 className="text-2xl">Topics</h1>
        </div>
        <div className="flex items-center gap-2">
          <p>{session.user?.name}</p>
          <Link
            href={"/api/auth/signout"}
            className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
          >
            user
          </Link>
        </div>
      </SessionNav>
      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <Link href="/home">All</Link>
          </div>
        </div>
      </main>
    </>
  );
}
