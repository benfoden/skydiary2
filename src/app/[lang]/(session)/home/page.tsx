import { type Post } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
export const dynamic = "true";

const filterPostsByDateRange = (
  daysMin: number,
  daysMax: number,
  userPosts: Post[],
) => {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));

  return userPosts.filter((post) => {
    const postDate = new Date(post.createdAt);
    const startOfPostDate = new Date(postDate.setHours(0, 0, 0, 0));
    const timeDiff = today.getTime() - postDate.getTime();

    return (
      timeDiff > daysMin * oneDay &&
      timeDiff <= daysMax * oneDay &&
      startOfPostDate < startOfToday
    );
  });
};

function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <div className="flex flex-col items-start justify-between gap-2 py-2">
        <div className="text-xs">
          {post.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        {post.summary ?? post.content.slice(0, 70) + "..."}
      </div>
    </Card>
  );
}
export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/topics"} label={"topics"} />
        </div>
        <h1>home</h1>

        <DropDownMenu>
          <div className="text-decoration-none flex w-full items-start gap-4 px-6 py-3 no-underline sm:px-4 sm:py-2">
            {session?.user?.name}
          </div>

          <Link href={"/settings"}>
            <Button variant="menuElement">settings</Button>
          </Link>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">sign out</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <Suspense fallback={<Spinner />}>
            <PostsList />
          </Suspense>
        </div>
      </main>
    </>
  );
}

async function PostsList() {
  const userPosts = await api.post.getByUser();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: userTimezone,
  });

  const lastPostDate = new Date(
    userPosts[0]?.createdAt ?? 0,
  ).toLocaleDateString("en-US", {
    timeZone: userTimezone,
  });

  api.post
    .checkAndSummarizeLastPost({ userTimezone, today })
    .catch((error) =>
      console.error("Error summarizing the last entry:", error),
    );

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-4 sm:max-w-5xl">
        Today
        {lastPostDate !== today || userPosts?.length === 0 ? (
          <Link href="/today" prefetch={true}>
            <Button>Whats on your mind?</Button>
          </Link>
        ) : (
          <Link key={userPosts[0]?.id} href={`/entry/${userPosts[0]?.id}`}>
            <PostCard key={userPosts[0]?.id} post={userPosts[0]!} />
          </Link>
        )}
        {filterPostsByDateRange(0, 6, userPosts).length > 0 && (
          <>
            Last 7 days
            {filterPostsByDateRange(0, 6, userPosts).map((post) => (
              <Link key={post.id} href={`/entry/${post.id}`} prefetch={true}>
                <PostCard key={post.id} post={post} />
              </Link>
            ))}
          </>
        )}
        {filterPostsByDateRange(8, 30, userPosts).length > 0 && (
          <>
            Last 30 days
            {filterPostsByDateRange(8, 30, userPosts).map((post) => (
              <Link key={post.id} href={`/entry/${post.id}`}>
                <PostCard key={post.id} post={post} />
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
}
