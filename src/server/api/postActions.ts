import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export async function DeletePost({ postId }: { postId: string }) {
  await api.post.delete({ postId: postId });
  revalidatePath("/home");
  redirect("/home");
}
