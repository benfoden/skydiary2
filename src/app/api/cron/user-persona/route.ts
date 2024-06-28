import { type Persona } from "@prisma/client";
import { getResponseJSON } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { NEWPERSONAUSER, generatePersonaPrompt } from "~/utils/constants";

export async function GET() {
  try {
    const userPersonas = await api.persona.getAllUserPersonas();

    for (const userPersona of userPersonas) {
      const latestPost = await api.post.getLatestByInputUserId({
        userId: userPersona.createdById,
      });
      if (!latestPost?.content) {
        continue;
      }
      const generatedPersona = await getResponseJSON(
        generatePersonaPrompt(userPersona ?? NEWPERSONAUSER) +
          latestPost?.content,
      );

      if (!generatedPersona) {
        continue;
      }
      const personaObject = JSON.parse(generatedPersona) as Persona;
      await api.persona.update({
        personaId: userPersona?.id ?? "",
        name: userPersona?.name ?? "",
        description: personaObject?.description ?? "",
        image: userPersona?.image ?? "",
        age: personaObject?.age ?? 0,
        gender: personaObject?.gender ?? "",
        relationship: personaObject?.relationship ?? "",
        occupation: personaObject?.occupation ?? "",
        traits: personaObject?.traits ?? "",
        communicationStyle: personaObject?.communicationStyle ?? "",
        communicationSample: personaObject?.communicationSample ?? "",
      });
    }
    return Response.json({ message: "Tags added successfully." });
  } catch (error) {
    console.error("Error summarizing posts in cron job:", error);
    const { message, stack } = error as Error;
    console.error(message, stack);
    return Response.json({
      error: "Error summarizing posts in cron job:",
      message: message ?? "Unknown error",
      stack: stack ?? "Unknown stack",
    });
  }
}
