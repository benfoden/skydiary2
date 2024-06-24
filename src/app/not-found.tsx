import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "./_components/Button";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-col gap-4 rounded-lg bg-white/50 p-6 shadow-lg sm:w-96">
          <h1 className="flex w-full items-center justify-center text-xl font-light text-[#424245]">
            {t("error.notfound.heading")}
          </h1>
          <div className="text-center">
            <div className="flex flex-col items-center gap-3 text-sm">
              <p>{t("error.notfound.message")}</p>
              <Link href="/">
                <Button>{t("auth.back to home")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
