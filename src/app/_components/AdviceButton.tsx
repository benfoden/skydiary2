import { redirect } from "next/navigation";
import Button from "./Button";

import { revalidatePath } from "next/cache";
import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { generateCommentPrompt } from "~/utils/prompts";

export default function AdviceButton({
  postId,
  postContent,
  coachVariant,
}: {
  postId: string;
  postContent: string;
  coachVariant: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (!postId) return null;

  switch (coachVariant) {
    case "criticism":
      coachVariant;
      break;
    case "insight":
      coachVariant = "insight";
      break;
    case "boost":
      coachVariant = "boost";
      break;
    default:
      coachVariant = "criticism";
      break;
  }

  return (
    <>
      <form
        action={async () => {
          "use server";
          try {
            const prompt = generateCommentPrompt(coachVariant) + postContent;
            const response = await getResponse(prompt);
            if (response) {
              console.log("response", response);
              await api.comment.create({
                content: response,
                postId,
                coachVariant,
              });
              revalidatePath("/entry/" + postId);
              redirect("/entry/" + postId);
            } else {
              console.error("Failed to get a response for the comment.");
            }
          } catch (error) {
            console.error("Error creating comment:", error);
          }
        }}
      >
        <Button type="submit">{coachVariant}</Button>
      </form>
    </>
  );
}
