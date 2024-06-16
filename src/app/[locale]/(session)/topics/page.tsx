import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card } from "~/app/_components/Card";
import DropDownUser from "~/app/_components/DropDownUser";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const t = await getTranslations();
  const userPosts = await api.post.getByUser();

  const tagsAndCounts = await api.post.getTagsAndCounts();

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={t("nav.home")} />
        </div>
        <h1>{t("nav.topics")}</h1>

        <DropDownUser />
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <Link className="pb-4" href="/home">
              <Card>
                <p>{t("topics.all")}</p>
                <p>{userPosts.length}</p>
              </Card>
            </Link>
            {tagsAndCounts?.map(
              (tag) =>
                tag && (
                  <Link key={tag.id} href={`/topics/${tag.content}/${tag.id}`}>
                    <Card>
                      <p>{t(`topics.${tag.content}`)}</p>
                      <p>{tag.count}</p>
                    </Card>
                  </Link>
                ),
            )}
          </div>
        </div>
      </main>
    </>
  );
}
