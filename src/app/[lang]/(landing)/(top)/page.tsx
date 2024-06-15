import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { type Lang } from "~/utils/i18n";
import { getTranslations } from "../../dictionaries";

export default async function Top({
  params: { lang },
}: {
  params: { lang: Lang };
}) {
  const session = await getServerAuthSession();
  const t = await getTranslations(lang);

  return (
    <>
      <main className="mt-[-72px] flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Link href={session ? "/home" : "/auth/signin"}>
            <button
              type="button"
              className="flex flex-col items-center gap-2 rounded-full bg-white/40 px-16 py-12 hover:bg-white/60"
            >
              {session ? t("top.welcomeBack") : t("top.welcome")}
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
