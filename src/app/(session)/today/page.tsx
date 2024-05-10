import Button from "~/app/_components/Button";
import { EditPost } from "~/app/_components/EditPost";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { api } from "~/trpc/server";

export default async function Today() {
  const today = new Date().toISOString().slice(0, 10);
  let post = await api.post.getLatest();
  const postDate = post?.createdAt.toISOString().slice(0, 10);

  console.log("today", today);
  console.log("postDate", postDate);

  if (postDate !== today) {
    await api.post.create({ content: "" });
    post = await api.post.getLatest(); // Re-fetch the latest post after creation
  }

  return (
    <>
      <SessionNav>
        <NavChevronLeft targetPathname={"/home"} label="home" />
        <div>
          {post?.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
        </div>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {post ? <EditPost initialPost={post} /> : <div>Loading...</div>}
        </div>
      </main>
    </>
  );
}
