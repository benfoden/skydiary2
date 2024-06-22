import { PersonIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import DropDownUser from "~/app/_components/DropDownUser";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import PersonaFormFields from "~/app/_components/PersonaFormFields";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Persona({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) return redirect("/auth/signin");
  const personaId = params.id;
  const persona = await api.persona.getById({ isUser: false, personaId });
  if (!persona) return null;
  const t = await getTranslations();

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft
            targetPathname={"/persona/all"}
            label={t("nav.personas")}
          />
        </div>
        <h1>{persona.name}</h1>
        <DropDownUser />
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
                <FormButton variant="submit">{t("form.update")}</FormButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
