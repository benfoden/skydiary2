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
import { formattedTimeStampToDate } from "~/utils/text";

export default async function Entry({
  params,
}: {
  params: { content: string; id: string };
}) {
  const session = await getServerAuthSession();
  const posts = await api.post.getAllByUserAndTagId({ tagId: params.id });

  if (!posts || posts.length === 0) return <div>No posts found...</div>;

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/topics"} label={"topics"} />
        </div>
        <h1 className="font-light">{params.content}</h1>
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
      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="flex h-full flex-col items-center gap-12 px-4 pb-4">
          {posts && (
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center font-light">
                  <Spinner />
                </div>
              }
            >
              <ul>
                {posts.map((post) => (
                  <li key={post.id} className="flex flex-col rounded-lg p-4">
                    <Card>
                      <div className="flex w-full flex-col gap-4 pt-4">
                        <div className="flex w-full justify-between gap-4 text-xs">
                          <div className="font-medium">
                            {formattedTimeStampToDate(post.createdAt)}
                          </div>
                        </div>
                        <div className="max-w-md text-sm">
                          {post.content.slice(0, 140)}...
                        </div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}
