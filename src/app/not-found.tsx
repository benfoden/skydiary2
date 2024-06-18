import { useTranslations } from "next-intl";
import Link from "next/link";
import { Nav } from "./[locale]/(landing)/layout";
import Button from "./_components/Button";

export default function NotFound() {
  const t = useTranslations();
  return (
    <>
      <Nav />
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h2 className="text-3xl font-bold">{t("error.not found")}</h2>
          <Link href="/">
            <Button>{t("nav.home")}</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
