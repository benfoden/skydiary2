"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { determinePath } from "~/utils/routing-helpers";

export async function NavLeft() {
  const pathname = usePathname();

  return (
    <Link
      href={determinePath(pathname)}
      className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
    >
      <ChevronLeftIcon className="h-6 w-6" />
    </Link>
  );
}
