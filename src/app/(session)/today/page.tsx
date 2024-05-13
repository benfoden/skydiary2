import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function Today() {
  const post = await api.post.getLatest();

  const today = new Date();
  if (post?.createdAt.toDateString() !== today.toDateString()) {
    await api.post.create({ content: "" });
    const newPost = await api.post.getLatest();
    redirect("/entry/" + newPost?.id);
  }

  redirect("/entry/" + post?.id);
}
