import { type Persona, type Post } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownUser from "~/app/_components/DropDownUser";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { getResponseJSON } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { NEWPERSONAUSER, generatePersonaPrompt } from "~/utils/constants";
export const dynamic = "force-dynamic";

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
  const t = await getTranslations();
  const userPosts = await api.post.getByUser();
  const persona = await api.persona.getUserPersona();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: userTimezone,
  });

  const lastPostDate = new Date(
    userPosts[0]?.createdAt ?? 0,
  ).toLocaleDateString("en-US", {
    timeZone: userTimezone,
  });

  await api.post
    .checkAndSummarizeLastPost({ userTimezone, today })
    .catch((error) =>
      console.error("Error summarizing the last entry:", error),
    );

  async function updateUserPersona(post: Post) {
    const generatedPersona = await getResponseJSON(
      generatePersonaPrompt(persona ?? NEWPERSONAUSER) + post?.content,
    );

    if (typeof generatedPersona === "string") {
      const personaObject = JSON.parse(generatedPersona) as Persona;
      await api.persona.update({
        personaId: persona?.id ?? "",
        name: persona?.name ?? "",
        description: personaObject?.description ?? "",
        image: persona?.image ?? "",
        age: personaObject?.age ?? 0,
        gender: personaObject?.gender ?? "",
        relationship: personaObject?.relationship ?? "",
        occupation: personaObject?.occupation ?? "",
        traits: personaObject?.traits ?? "",
        communicationStyle: personaObject?.communicationStyle ?? "",
        communicationSample: personaObject?.communicationSample ?? "",
      });
    }
  }

  //update the persona if it's older than the last post
  for (const post of userPosts) {
    if (!persona) {
      return;
    }
    if (persona.updatedAt <= post.createdAt) {
      await updateUserPersona(post);
    }
  }

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/topics"} label={t("nav.topics")} />
        </div>
        <h1>{t("nav.home")}</h1>
        <DropDownUser />
      </SessionNav>
      <main className="flex min-h-screen flex-col items-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <Suspense fallback={<Spinner />}>
            <div className="flex flex-col items-start justify-center gap-4 sm:max-w-5xl">
              {t("home.today")}
              {lastPostDate !== today || userPosts?.length === 0 ? (
                <Link href="/today" prefetch={true}>
                  <Button>{t("home.whats happening")}</Button>
                </Link>
              ) : (
                <Link
                  key={userPosts[0]?.id}
                  href={`/entry/${userPosts[0]?.id}`}
                >
                  <PostCard key={userPosts[0]?.id} post={userPosts[0]!} />
                </Link>
              )}
              {filterPostsByDateRange(0, 6, userPosts).length > 0 && (
                <>
                  {t("home.last7Days")}
                  {filterPostsByDateRange(0, 6, userPosts).map((post) => (
                    <Link
                      key={post.id}
                      href={`/entry/${post.id}`}
                      prefetch={true}
                    >
                      <PostCard key={post.id} post={post} />
                    </Link>
                  ))}
                </>
              )}
              {filterPostsByDateRange(8, 30, userPosts).length > 0 && (
                <>
                  {t("home.last30Days")}
                  {filterPostsByDateRange(8, 30, userPosts).map((post) => (
                    <Link key={post.id} href={`/entry/${post.id}`}>
                      <PostCard key={post.id} post={post} />
                    </Link>
                  ))}
                </>
              )}
            </div>
          </Suspense>
        </div>
      </main>
    </>
  );
}
