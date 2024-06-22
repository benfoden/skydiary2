import { redirect } from "next/navigation";
import { api } from "~/app/api/trpc/server";

export default async function Today() {
  const post = await api.post.getLatest();

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: userTimezone,
  });

  if (
    post?.createdAt.toLocaleDateString("en-US", {
      timeZone: userTimezone,
    }) !== today
  ) {
    await api.post.create({ content: "" });
    const newPost = await api.post.getLatest();
    redirect("/entry/" + newPost?.id);
  }

  redirect("/entry/" + post?.id);
}
