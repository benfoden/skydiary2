import Link from "next/link";
import Button from "~/app/_components/Button";

export default async function About() {
  return (
    <>
      <main className="mt-[-72px] flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center px-4 py-8">
          <div className="flex flex-col gap-4">
            <p className="text-xl">about skydiary</p>
            <p>the benefits of journaling are countless</p>
            <p>normally the process of writing is solitary and private</p>
            <p>skydiary is a private space, but not so solitary</p>
            <p>
              with the help of AI, you get totally private advice and counsel
            </p>
            <p>
              the emphasis is on simplicity. all you need to do is write a daily
              entry
            </p>
            <p>
              the AI assistant will tag your entry, recap your week, and give
              advice when you want it
            </p>
            <p>
              you get feedback on your progress over time and learn new things
              you might not have imagined
            </p>
            <Link href="/auth/signin">
              <Button variant="cta">try it</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
