import { type NextRequest } from "next/server";
import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { TAGS } from "~/utils/constants";
import { prompts } from "~/utils/prompts";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    const userPersonas = await api.persona.getAllUserPersonas();

    for (const userPersona of userPersonas) {
      const latestPost = await api.post.getLatestByInputUserId({
        userId: userPersona.createdById,
      });
      if (!latestPost?.content) {
        continue; // Changed from return to continue to ensure all userPersonas are processed
      }
      const newTags = await getResponse(
        prompts.generateTagsPrompt(latestPost?.content),
      );
      if (!newTags) {
        continue; // Changed from return to continue to ensure all userPersonas are processed
      }

      const tagContents = newTags?.split(",").map((tag) => tag.trim());

      const tagIds = tagContents
        ?.map((content) => {
          const tag = TAGS.find((tag) => tag.content === content);
          return tag?.id ?? undefined;
        })
        .filter((tag): tag is string => tag !== undefined);
      if (!tagIds?.length) {
        continue; // Changed from return to continue to ensure all userPersonas are processed
      }
      await api.post.addTags({
        postId: latestPost?.id,
        tagIds: tagIds,
      });

      return Response.json({ message: "Tags added successfully." });
    }
  } catch (error) {
    console.error("Error adding tags in cron job:", error);
    const { message, stack } = error as Error;
    console.error(message, stack);
    return Response.json({
      error: "Error adding tags in cron job:",
      message: message ?? "Unknown error",
      stack: stack ?? "Unknown stack",
    });
  }
}
