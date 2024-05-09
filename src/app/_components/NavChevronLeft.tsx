import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export async function NavChevronLeft({
  targetPathname,
  label,
}: {
  targetPathname: string;
  label?: string;
}) {
  return (
    <Link
      href={targetPathname}
      className="flex rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60"
    >
      <ChevronLeftIcon className="h-6 w-6" />
      <span>{label}</span>
    </Link>
  );
}
