import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { prompts } from "~/utils/prompts";

export default async function Secret() {
  const currentUserPersona = await api.persona.getUserPersona();
  const persona = await api.persona.getById({
    personaId: "clxyqqo3l00005ep3t8amw32a",
  });
  let greeting = "Welcome back. ";
  if (persona && currentUserPersona) {
    greeting += await getResponse(
      prompts.personaCommentPrompt(
        persona,
        "Working on the app again, in the admin zone! _prompt: Make this message a single sentence.",
        currentUserPersona,
      ),
    );
  }
  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        <div className="container flex flex-col items-start justify-start gap-12 px-8  py-16 ">
          {greeting}
        </div>
      </main>
    </>
  );
}
