import Link from "next/link";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";

export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>Topics</h1>

        <DropDownMenu>
          <Link href={"/api/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <Link href="/home">
              <Card>
                <p>All</p>
                <p>17</p>
              </Card>
            </Link>
            <Link href="/home">
              <Card>
                <p>Health</p>
                <p>11</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
