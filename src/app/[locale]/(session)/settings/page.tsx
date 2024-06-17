import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Settings() {
  const session = await getServerAuthSession();

  if (!session?.user) return null;
  const userPersona = await api.persona.getUserPersona();
  const t = await getTranslations();
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={t("nav.home")} />
        </div>
        <h1>{t("nav.settings")}</h1>

        <DropDownMenu>
          <Link href={"/auth/signout"}>
            <Button variant="menuElement">
              {t("nav.signout")} {session.user?.name}
            </Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex w-80 flex-col items-center justify-start gap-12 px-4 py-16">
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <p className="text-sm opacity-60">{t("settings.description")}</p>
            <form
              className="flex flex-col gap-4"
              action={async (formData) => {
                "use server";
                const name: string = formData.get("name") as string;
                const age = Number(formData.get("age"));
                const gender: string = formData.get("gender") as string;
                const isUser = true;

                if (name) {
                  try {
                    await api.user.updateUser({ name });
                    if (!userPersona) {
                      await api.persona.create({
                        name,
                        age,
                        gender,
                        traits: "",
                        isUser,
                      });
                    } else {
                      await api.persona.update({
                        personaId: userPersona?.id,
                        name,
                        age,
                        gender,
                        traits: "",
                        isUser,
                      });
                    }
                  } catch (error) {
                    console.error("Error updating user:", error);
                  }
                }
              }}
            >
              <label className="text-base font-light" htmlFor="name">
                {t("settings.your name")}
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                  defaultValue={session.user.name ?? ""}
                  placeholder="name"
                />
              </label>
              <label className="text-base font-light" htmlFor="age">
                {t("settings.your age")}
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                  defaultValue={userPersona?.age ?? 0}
                  placeholder="1"
                />
              </label>
              <label className="text-base font-light" htmlFor="gender">
                {t("settings.your identities")}
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                  defaultValue={userPersona?.gender ?? ""}
                  placeholder={t("settings.placeholder identities")}
                />
              </label>
              <FormButton variant="submit">{t("form.save")}</FormButton>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
