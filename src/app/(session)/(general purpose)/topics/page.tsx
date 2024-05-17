import { type Post } from "@prisma/client";
import Link from "next/link";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

async function TagsList({ userPosts }: { userPosts: Post[] }) {
  const userTags = await api.tag.getByUser();

  return (
    <>
      {userTags.map((tag) => (
        <Link key={tag.id} href={`/topic/${tag.id}`}>
          <Card>
            <div className="flex flex-col items-start justify-between gap-2 py-2">
              {tag.content}
              <p>
                {
                  userPosts.filter((post) =>
                    post.tag.some((t) => t.id === tag.id),
                  ).length
                }
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </>
  );
}

export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const userPosts = await api.post.getByUser();

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>topics</h1>

        <DropDownMenu>
          <Link href={"/api/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <Link href="/home">
              <Card>
                <p>All</p>
                <p>{userPosts.length}</p>
              </Card>
            </Link>
            <TagsList userPosts={userPosts} />
          </div>
        </div>
      </main>
    </>
  );
}
