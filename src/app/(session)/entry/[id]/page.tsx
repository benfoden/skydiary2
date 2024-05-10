import { EditPost } from "~/app/_components/EditPost";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import { generateCommentPrompt, generateTagsPrompt } from "~/utils/prompts";
import { analyzeSentiment } from "~/utils/text";

export default async function Entry({ params }: { params: { id: string } }) {
  const post = await api.post.getByPostId({ postId: params.id });

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
          <div className="rounded-full bg-white/30 px-4 py-2 no-underline">
            {analyzeSentiment(post?.content ?? "")?.score}
          </div>
        </div>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>
            {await getResponse(
              generateCommentPrompt("criticism") + post?.content ?? "",
            )}
          </div>
          <div>
            {await getResponse(
              generateCommentPrompt("insight") + post?.content ?? "",
            )}
          </div>
          <div>
            {await getResponse(
              generateCommentPrompt("boost") + post?.content ?? "",
            )}
          </div>
          <div>
            {await getResponse(generateTagsPrompt + post?.content ?? "")}
          </div>
          {post ? <EditPost initialPost={post} /> : <div>Loading...</div>}
        </div>
      </main>
    </>
  );
}
