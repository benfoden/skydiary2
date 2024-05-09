import Link from "next/link";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";

export default async function Topics() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  return (
    <>
      <SessionNav>
        <div />
        <div>
          <h1 className="text-2xl">Topics</h1>
        </div>
        <div className="flex items-center gap-2">
          <p>{session.user?.name}</p>
          <Link href={"/api/auth/signout"}>
            <Button>user</Button>
          </Link>
        </div>
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
