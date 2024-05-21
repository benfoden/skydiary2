import Link from "next/link";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

async function TagsList({
  tagsList,
}: {
  tagsList: Array<{ content: string; id: string; count: number }>;
}) {
  return (
    <>
      {tagsList?.map(
        (tag) =>
          tag && (
            <Link key={tag.id} href={`/topics/${tag.content}/${tag.id}`}>
              <Card>
                <p>{tag.content}</p>
                <p>{tag.count}</p>
              </Card>
            </Link>
          ),
      )}
    </>
  );
}
export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const userPosts = await api.post.getByUser();

  const tagsAndCounts = await api.post.getTagsAndCounts();

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>topics</h1>

        <DropDownMenu>
          <div className="text-decoration-none flex w-full items-start gap-4 px-6 py-3 no-underline sm:px-4 sm:py-2">
            {session?.user?.name}
          </div>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
          <Link href={"/settings"}>
            <Button variant="menuElement">settings</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <Link className="pb-4" href="/home">
              <Card>
                <p>all</p>
                <p>{userPosts.length}</p>
              </Card>
            </Link>
            <TagsList tagsList={tagsAndCounts} />
          </div>
        </div>
      </main>
    </>
  );
}
