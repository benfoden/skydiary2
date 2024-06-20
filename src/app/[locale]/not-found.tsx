"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "../_components/Button";
import { Nav } from "./(landing)/layout";
export default function NotFound() {
  const t = useTranslations();

  return (
    <>
      <Nav />
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h2 className="text-3xl font-bold">{t("error.notfound.heading")}</h2>
          <p>{t("error.notfound.message")}</p>
          <Link href="/">
            <Button>{t("auth.back to home")}</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
