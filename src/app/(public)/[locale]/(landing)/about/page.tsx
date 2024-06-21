import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Button from "~/app/_components/Button";

export default async function About() {
  const t = await getTranslations();
  return (
    <>
      <main className="mt-[-72px] flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center px-4 py-8">
          <div className="flex flex-col gap-4">
            <p className="text-xl">{t("about.title")}</p>
            <p>{t("about.description 0")}</p>
            <p>{t("about.description 1")}</p>
            <p>{t("about.description 2")}</p>
            <p>{t("about.description 3")}</p>
            <p>{t("about.description 4")}</p>
            <p>{t("about.description 5")}</p>
            <div className="pt-8">
              <Link href="/auth/signin">
                <Button variant="cta">{t("about.try it")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
