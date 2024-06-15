import { PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import PersonaFormFields from "~/app/_components/PersonaFormFields";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Persona({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const personaId = params.id;
  const persona = await api.persona.getById({ personaId });
  if (!persona) return null;

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/persona/all"} label={"personas"} />
        </div>
        <h1>{persona.name}</h1>
        <DropDownMenu>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">Sign out {session.user?.name}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col items-start justify-center gap-4">
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
                      await api.persona.update({
                        personaId,
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
                    redirect("/persona/all");
                  }
                }}
              >
                <div className="flex w-full flex-row items-center justify-center">
                  {persona.image ? (
                    <Image
                      alt={persona.name}
                      src={persona.image ?? ""}
                      width="64"
                      height="64"
                      className="rounded-full"
                    />
                  ) : (
                    <PersonIcon className="h-16 w-16" />
                  )}
                </div>
                <PersonaFormFields persona={persona} />
                <FormButton variant="submit">update</FormButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
