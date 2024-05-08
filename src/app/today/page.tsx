import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { formattedDate } from "~/utils/text";

export default async function Today() {
  return (
    <>
      <nav className="flex w-full items-center justify-between bg-transparent p-4 text-[#424245]">
        <Link
          href="/home"
          className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Link>
        <div>{formattedDate}</div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            1
          </button>
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            2
          </button>
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            3
          </button>
        </div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <CrudShowcase />
        </div>
      </main>
    </>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <>
          <p className="truncate">{latestPost.content}</p>
        </>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}
