"use client";
import { type Post } from "@prisma/client";
import { analyzeSentiment } from "~/utils/text";
import DropDownMenu from "./DropDown";
import { EditPost } from "./EditPost";
import { NavChevronLeft } from "./NavChevronLeft";
import { SessionNav } from "./SessionNav";

const EntryBody = ({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}): React.ReactElement => {
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
        <div>
          <DropDownMenu>
            <div className="flex items-center gap-2 px-4 py-2">
              {analyzeSentiment(post?.content ?? "")?.score}
            </div>
            <button
              className="text-decoration-none text-primary rounded-full px-4 py-2 no-underline hover:bg-white/60"
              onClick={async () => {
                await navigator.clipboard.writeText(post?.content ?? "");
              }}
            >
              Copy
            </button>
          </DropDownMenu>
        </div>
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
          {children}
        </div>
      </main>
    </>
  );
};

export default EntryBody;
