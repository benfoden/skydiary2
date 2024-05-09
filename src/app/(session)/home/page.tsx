import Link from "next/link";
import { CardPost } from "~/app/_components/CardPost";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { formattedDate } from "~/utils/text";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/topics"} label={"topics"} />
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

      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <CrudShowcase />
        </div>
      </main>
    </>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest();

  return (
    <>
      {latestPost ? (
        <div className="flex flex-col items-start justify-center gap-4">
          <CardPost>
            <Link href="/today">{formattedDate}</Link>
          </CardPost>
          Last 7 days
          <p className="truncate">{latestPost.content}</p>
          Last 30 days
          <p className="truncate">{latestPost.content}</p>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </>
  );
}
