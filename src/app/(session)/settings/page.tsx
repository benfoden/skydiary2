import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import FormButton from "~/app/_components/FormButton";
import Input from "~/app/_components/Input";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { ThemeToggle } from "~/app/_components/ToggleTheme";
import { setUserLocale } from "~/i18n";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Settings() {
  const session = await getServerAuthSession();

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
            <Button variant="menuElement">{t("nav.signout")}</Button>
          </Link>
        </DropDownMenu>
      </SessionNav>

      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex w-80 flex-col items-center justify-start gap-12 px-4 py-16">
          <div className="mt-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-black/60">
            <h2>{t("settings.personal")}</h2>
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
              <Input
                id="name"
                name="name"
                placeholder={t("settings.placeholderName")}
                required
                labelText={t("settings.your name")}
                defaultValue={session?.user.name ?? ""}
              />
              <Input
                type="number"
                id="age"
                name="age"
                required
                placeholder="1"
                defaultValue={userPersona?.age ?? 0}
                labelText={t("settings.your age")}
              />

              <Input
                id="gender"
                name="gender"
                required
                placeholder={t("settings.placeholder identities")}
                defaultValue={userPersona?.gender ?? ""}
                labelText={t("settings.your identities")}
              />

              <FormButton variant="submit">{t("form.save")}</FormButton>
            </form>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-black/60">
            <h2>{t("settings.language")}</h2>
            <div className="flex flex-row gap-2">
              <form
                action={async () => {
                  "use server";
                  await setUserLocale("en");
                  redirect("/settings");
                }}
              >
                <FormButton variant="menuElement">
                  {t("settings.en")}
                </FormButton>
              </form>
              <form
                action={async () => {
                  "use server";
                  await setUserLocale("ja");
                  redirect("/settings");
                }}
              >
                <FormButton variant="menuElement">
                  {t("settings.ja")}
                </FormButton>
              </form>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-black/60">
            <h2>{t("settings.theme")}</h2>
            <div>
              <ThemeToggle isMenuButton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
