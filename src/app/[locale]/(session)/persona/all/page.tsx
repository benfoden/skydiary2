import { PersonIcon, PlusIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import DropDownUser from "~/app/_components/DropDownUser";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import PersonaFormFields from "~/app/_components/PersonaFormFields";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Persona() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const t = await getTranslations();

  const personas = await api.persona.getAllByUserId();
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/today"} label={t("nav.today")} />
        </div>
        <h1>{t("nav.personas")}</h1>
        <DropDownUser />
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <div className="flex w-full flex-col items-center justify-center gap-4 border-zinc-900 md:flex-row md:items-start md:px-32">
            <div className="mb-4 flex flex-col items-start justify-center gap-4">
              <a href="#newPersona" className="flex items-center gap-2">
                <Button>
                  <PlusIcon className="h-5 w-5" /> {t("personas.add new")}
                </Button>
              </a>{" "}
              {personas && (
                <>
                  {personas?.map((persona) => (
                    <Link key={persona.id} href={`/persona/${persona.id}`}>
                      <Card variant="narrow">
                        {persona.image ? (
                          <Image
                            alt={persona.name}
                            src={persona.image}
                            width="32"
                            height="32"
                            className="rounded-full"
                          />
                        ) : (
                          <PersonIcon className="h-8 w-8" />
                        )}
                        <h2>{persona.name}</h2>
                      </Card>
                    </Link>
                  ))}
                </>
              )}
            </div>
            <div
              id="newPersona"
              className="mb-4 flex flex-col items-start justify-center gap-4"
            >
              {t("personas.new persona")}
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
                    revalidatePath("/persona/all");
                    redirect("/persona/all");
                  }
                }}
              >
                <PersonaFormFields />
                <FormButton variant="submit">{t("form.create")}</FormButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
