import { PlusIcon } from "@radix-ui/react-icons";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Persona() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const personas = await api.persona.getAllByUserId();
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>personas</h1>
        <DropDownMenu>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <a
            href="#newPersona"
            className="flex items-center gap-2 text-zinc-500 transition hover:text-zinc-700"
          >
            <Button>
              <PlusIcon className="h-5 w-5" />
              <span>new</span>
            </Button>
          </a>
          <div className="flex flex-col gap-4 md:flex-row">
            {personas && (
              <div className="mb-4 flex flex-col items-start justify-center gap-4">
                your personas
                {personas?.map((persona) => (
                  <Link key={persona.id} href={`/persona/${persona.id}`}>
                    <Card>
                      <h2>{persona.name}</h2>
                      <p>{persona.traits}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            <div
              id="newPersona"
              className="mb-4 flex flex-col items-start justify-center gap-4"
            >
              new persona
              <form
                className="flex flex-col items-start justify-center gap-4"
                action={async (formData) => {
                  "use server";
                  const name: string = formData.get("name") as string;
                  const traits: string = formData.get("traits") as string;
                  const description: string = formData.get(
                    "description",
                  ) as string;
                  const image: string = formData.get("image") as string;
                  const age = Number(formData.get("age"));
                  const gender: string = formData.get("gender") as string;
                  const relationship: string = formData.get(
                    "relationship",
                  ) as string;
                  const occupation: string = formData.get(
                    "occupation",
                  ) as string;
                  const communicationStyle: string = formData.get(
                    "communicationStyle",
                  ) as string;
                  const communicationSample: string = formData.get(
                    "communicationSample",
                  ) as string;

                  if (name && traits) {
                    try {
                      await api.persona.create({
                        name,
                        traits,
                        description,
                        image,
                        age,
                        gender,
                        relationship,
                        occupation,
                        communicationStyle,
                        communicationSample,
                      });
                    } catch (error) {
                      console.error("Error updating persona:", error);
                    }
                    revalidatePath("/persona");
                  }
                }}
              >
                <label className="text-base font-light" htmlFor="name">
                  name
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    required
                    placeholder="Bill, Jane, Lee..."
                  />
                </label>
                <label className="text-base font-light" htmlFor="traits">
                  traits
                  <input
                    type="text"
                    id="traits"
                    name="traits"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    required
                    placeholder="friendly, loving, creative..."
                  />
                </label>
                <label className="text-base font-light" htmlFor="description">
                  a short description{" "}
                  <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="they love to dance and sing.. they've been through a lot, and they've grown a lot."
                  />
                </label>
                <label className="text-base font-light" htmlFor="image">
                  image <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </label>
                <label className="text-base font-light" htmlFor="age">
                  age <span className="opacity-60">(optional)</span>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="10"
                  />
                </label>
                <label className="text-base font-light" htmlFor="gender">
                  orientation <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="man, robot, she-wolf..."
                  />
                </label>
                <label className="text-base font-light" htmlFor="relationship">
                  relationship with you{" "}
                  <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="relationship"
                    name="relationship"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="friend, partner, dad, advisor..."
                  />
                </label>
                <label className="text-base font-light" htmlFor="occupation">
                  occupation <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="student, coach, teacher, engineer..."
                  />
                </label>
                <label
                  className="text-base font-light"
                  htmlFor="communicationStyle"
                >
                  communication style{" "}
                  <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="communicationStyle"
                    name="communicationStyle"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="assertive, direct, empathetic..."
                  />
                </label>
                <label
                  className="text-base font-light"
                  htmlFor="communicationSample"
                >
                  communication sample{" "}
                  <span className="opacity-60">(optional)</span>
                  <input
                    type="text"
                    id="communicationSample"
                    name="communicationSample"
                    className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                    placeholder="If you can walk you can dance, if you can talk you can sing."
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/70 px-4 text-base font-light transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
                >
                  create persona
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
