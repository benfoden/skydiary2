import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { formattedDate } from "~/utils/text";
import { CardPost } from "../_components/card-post";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
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
    </div>
  );
}
