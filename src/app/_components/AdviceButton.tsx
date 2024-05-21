import { redirect } from "next/navigation";
import Button from "./Button";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { revalidatePath } from "next/cache";
import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { generateCoachPrompt, generateCommentPrompt } from "~/utils/constants";

export default function AdviceButton({
  postId,
  postContent,
}: {
  postId: string;
  postContent: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (!postId) return null;

  return (
    <>
      <form
        action={async () => {
          "use server";
          try {
            const coachVariant = await getResponse(
              generateCoachPrompt + postContent,
            );
            const prompt = generateCommentPrompt(coachVariant!) + postContent;
            const response = await getResponse(prompt);
            if (response) {
              console.log("response", response);
              await api.comment.create({
                content: response,
                postId,
                coachVariant: coachVariant!,
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
        <Button type="submit">
          <ChatBubbleIcon className="h-5 w-5" />
        </Button>
      </form>
    </>
  );
}
