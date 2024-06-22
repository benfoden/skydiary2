import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import GetTagsButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { api } from "~/app/api/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { TAGS } from "~/utils/constants";

export default async function Secret() {
  const session = await getServerAuthSession();
  if (session?.user.email !== "ben.foden@gmail.com") redirect("/home");

  const tags = await api.tag.getAll();

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

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-col items-start justify-center gap-4">
            <form
              action={async () => {
                "use server";
                try {
                  await Promise.all(
                    TAGS.map((tag) =>
                      api.tag.create({
                        content: tag.content.trim(),
                      }),
                    ),
                  );
                } catch (error) {
                  console.error("Error creating tags:", error);
                }
              }}
            >
              <GetTagsButton>
                <Button variant="primary">Create tags</Button>
              </GetTagsButton>
            </form>
            {tags && (
              <ul>
                {tags.map((tag) => (
                  <li key={tag.id} className="flex flex-col rounded-lg p-2">
                    <div className="flex w-full justify-between gap-4 text-xs">
                      <div className="font-medium">{tag.content}</div>
                      <div className="font-medium">{tag.id}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
