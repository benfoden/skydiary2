import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

/**
 * This page is where new users logging in for the first time are
 * redirected to, by Next Auth. Here we will just create two welcome
 * notifications and redirect them back on their way.
 */
const NewUserPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (!session) return redirect("/auth/signin");
  if (session.user.name) return redirect("/home");
  const t = await getTranslations();

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center">
          <h1>
            <span className="text-xl font-light">skydiary</span>
          </h1>

          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <p className="text-sm opacity-60">{t("auth.description")}</p>
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
                    await api.persona.create({
                      name,
                      age: age ?? 0,
                      gender: gender ?? "",
                      traits: "",
                      isUser,
                    });
                  } catch (error) {
                    console.error("Error updating user:", error);
                  }
                  redirect("/home");
                }
              }}
            >
              <label className="text-base font-light" htmlFor="name">
                {t("form.your name")}{" "}
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                />
              </label>
              <label className="text-base font-light" htmlFor="age">
                {t("form.your age")}
                <span className="text-xs opacity-60">
                  ({t("form.optional")})
                </span>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  placeholder="1"
                />
              </label>
              <label className="text-base font-light" htmlFor="gender">
                {t("form.your identities")}
                <span className="text-xs opacity-60">
                  ({t("form.optional")})
                </span>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  placeholder={t("form.placeholder identities")}
                />
              </label>
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/70 px-4 text-base font-light transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
              >
                {t("auth.save and continue")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
