import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import GetTagsButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { TAGS } from "~/utils/constants";

export default async function Secret() {
  const session = await getServerAuthSession();
  if (session?.user.email !== "ben.foden@gmail.com") redirect("/home");

  const tags = await api.tag.getAll();

  const userPersona = await api.persona.getUserPersona();

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
        <div className="container flex flex-col items-start justify-start gap-12 px-8  py-16 ">
          <details>
            <summary>tags</summary>
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
                <GetTagsButton>Update global tags from TAGS</GetTagsButton>
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
          </details>
          <details>
            <summary>user persona</summary>
            <p>
              {userPersona && (
                <>
                  <div className="flex flex-col items-start justify-center gap-4">
                    <h2>Last updated at {userPersona.updatedAt.toString()}</h2>
                    <div className="flex w-full items-start gap-4 text-xs">
                      <div className="font-medium">{userPersona.name}</div>
                      <div className="font-medium">{userPersona.gender}</div>
                      <div className="font-medium">{userPersona.age}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-4">
                    <div className="flex w-full flex-col justify-between gap-4 text-xs">
                      <div className="font-medium">
                        <strong>Description:</strong> {userPersona.description}
                      </div>
                      <div className="font-medium">
                        <strong>Relationship:</strong>{" "}
                        {userPersona.relationship}
                      </div>
                      <div className="font-medium">
                        <strong>Occupation:</strong> {userPersona.occupation}
                      </div>
                      <div className="font-medium">
                        <strong>Traits:</strong> {userPersona.traits}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </p>
          </details>
        </div>
      </main>
    </>
  );
}
