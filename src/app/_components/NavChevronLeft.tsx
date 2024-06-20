"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Start of Selection
export function NavChevronLeft({
  targetPathname,
  label,
  isDisabled,
  isBack = false,
}: {
  targetPathname?: string;
  label?: string;
  isDisabled?: boolean;
  isBack?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Link
      href={!isDisabled && !isBack && targetPathname ? targetPathname : ""}
      className={`flex rounded-full bg-white/30 px-4 py-2 no-underline transition ${!isDisabled ? "hover:bg-white/60" : "cursor-not-allowed"}`}
      prefetch={true}
      onClick={() => isBack && router.back()}
    >
      <ChevronLeftIcon className="h-6 w-6" />
      <span>{isBack ? t("nav.back") : label}</span>
    </Link>
  );
}
