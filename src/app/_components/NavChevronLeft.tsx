import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

// Start of Selection
export function NavChevronLeft({
  targetPathname,
  label,
  isDisabled,
}: {
  targetPathname: string;
  label?: string;
  isDisabled?: boolean;
}) {
  return (
    <Link
      href={!isDisabled ? targetPathname : "#"}
      className={`flex rounded-full bg-white/30 px-4 py-2 no-underline transition ${!isDisabled ? "hover:bg-white/60" : "cursor-not-allowed"}`}
    >
      <ChevronLeftIcon className="h-6 w-6" />
      <span>{label}</span>
    </Link>
  );
}
