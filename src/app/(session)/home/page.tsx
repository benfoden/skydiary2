import { type Post } from "@prisma/client";
import Link from "next/link";
import { Card } from "~/app/_components/Card";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const filterPostsByDateRange = (
  daysMin: number,
  daysMax: number,
  userPosts: Post[],
) => {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  return userPosts.filter((post) => {
    const postDate = new Date(post.createdAt);
    const timeDiff = today.getTime() - postDate.getTime();
    return timeDiff > daysMin * oneDay && timeDiff <= daysMax * oneDay;
  });
};

function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <div className="flex flex-col items-start justify-between gap-2 py-2">
        <div>
          {post.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        {post.content && <div>{post.content}</div>}
      </div>
    </Card>
  );
}

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
            className="rounded-full bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
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
  const userPosts = await api.post.getByUser();

  return (
    <>
      {userPosts?.length > 0 ? (
        <div className="flex flex-col items-start justify-center gap-4">
          Today
          {filterPostsByDateRange(0, 1, userPosts).map((post) => (
            <Link key={post.id} href="/today">
              <PostCard key={post.id} post={post} />
            </Link>
          ))}
          {filterPostsByDateRange(1, 7, userPosts).length > 0 && (
            <>
              Last 7 days
              {filterPostsByDateRange(1, 7, userPosts).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          )}
          {filterPostsByDateRange(8, 30, userPosts).length > 0 && (
            <>
              Last 30 days
              {filterPostsByDateRange(8, 30, userPosts).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </>
  );
}