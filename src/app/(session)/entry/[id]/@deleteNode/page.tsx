import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

import { Cross1Icon } from "@radix-ui/react-icons";
import Button from "~/app/_components/Button";

export default function DeleteButton({
  postId,
}: {
  postId: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (!postId) return null;
  return (
    <form
      action={async () => {
        "use server";
        await api.post.delete({ postId: postId });
        revalidatePath("/home");
        redirect("/home");
      }}
    >
      <Button variant="menuElement" type="submit">
        Delete <Cross1Icon className="h-5 w-5" />
      </Button>
    </form>
  );
}
