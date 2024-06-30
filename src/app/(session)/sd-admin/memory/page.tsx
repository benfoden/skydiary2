import { getTranslations } from "next-intl/server";
import { Card } from "~/app/_components/Card";
import FormButton from "~/app/_components/FormButton";
import Input from "~/app/_components/Input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Secret() {
  const session = await getServerAuthSession();
  const userPersona = await api.persona.getUserPersona();
  const t = await getTranslations();

  return (
    <>
      <Card variant="form">
        <div className="flex w-[512px] flex-col items-center gap-4">
          <h2>Current persona</h2>
          <form
            className="flex w-full flex-col gap-4"
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
              label={t("settings.your name")}
              defaultValue={session?.user.name ?? ""}
            />
            <Input
              type="number"
              id="age"
              name="age"
              required
              placeholder="1"
              defaultValue={userPersona?.age ?? 0}
              label={t("settings.your age")}
            />
            <Input
              id="gender"
              name="gender"
              required
              placeholder={t("settings.placeholder identities")}
              defaultValue={userPersona?.gender ?? ""}
              label={t("settings.your identities")}
            />
            <Input
              type="textarea"
              id="traits"
              name="traits"
              label={t("settings.your traits")}
              defaultValue={userPersona?.traits ?? ""}
            />
            <Input
              type="textarea"
              id="description"
              name="description"
              label={t("settings.your description")}
              defaultValue={userPersona?.description ?? ""}
            />
            <Input
              type="textarea"
              id="relationship"
              name="relationship"
              label={t("settings.your relationship")}
              defaultValue={userPersona?.relationship ?? ""}
            />
            <Input
              id="occupation"
              name="occupation"
              label={t("settings.your occupation")}
              defaultValue={userPersona?.occupation ?? ""}
            />
            <Input
              id="communicationStyle"
              name="communicationStyle"
              label={t("settings.your communication style")}
              defaultValue={userPersona?.communicationStyle ?? ""}
            />
            <Input
              id="communicationSample"
              name="communicationSample"
              label={t("settings.your communication sample")}
              defaultValue={userPersona?.communicationSample ?? ""}
            />

            <FormButton variant="submit">{t("form.save")}</FormButton>
          </form>
        </div>
      </Card>
    </>
  );
}
