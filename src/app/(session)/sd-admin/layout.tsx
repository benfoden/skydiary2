import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user.email !== "ben.foden@gmail.com") redirect("/home");

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>admin zone</h1>

        <DropDownMenu>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <div className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-start justify-start gap-12 px-8  py-16 ">
          <div className="flex flex-row gap-4">
            <Link href={"/sd-admin/memory"}>memory</Link>
            <Link href={"/sd-admin/tags"}>tags</Link>
            <Link href={"/sd-admin/prompts"}>prompts</Link>
            <Link href={"/sd-admin/sandbox"}>sandbox</Link>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
