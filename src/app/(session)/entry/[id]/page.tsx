import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import DropDownMenu from "~/app/_components/DropDown";
import { EditPost } from "~/app/_components/EditPost";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { api } from "~/trpc/server";
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
        <DropDownMenu>
          <div className="flex items-center gap-2 px-4 py-2">
            {analyzeSentiment(post?.content ?? "")?.score}
          </div>
          <Button variant="menuElement">Copy text</Button>
          <form
            action={async () => {
              "use server";
              await api.post.delete({ postId: params.id });
              revalidatePath("/home");
              redirect("/home");
            }}
          >
            <Button variant="menuElement" type="submit">
              Delete
            </Button>
          </form>
        </DropDownMenu>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {/* <div>
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
          </div> */}
          {post ? <EditPost initialPost={post} /> : <div>Loading...</div>}
        </div>
      </main>
    </>
  );
}
