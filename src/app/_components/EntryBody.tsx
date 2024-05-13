"use client";
import { type Post } from "@prisma/client";
import { getResponse } from "~/server/api/ai";
import { generateCommentPrompt, generateTagsPrompt } from "~/utils/prompts";
import { analyzeSentiment } from "~/utils/text";
import Button from "./Button";
import DropDownMenu from "./DropDown";
import { EditPost } from "./EditPost";
import { NavChevronLeft } from "./NavChevronLeft";
import { SessionNav } from "./SessionNav";

const handleGetResponse = async (commentType: string) => {
  "use server";
  const prompt =
    commentType === "tags"
      ? generateTagsPrompt(post?.content ?? "")
      : generateCommentPrompt(commentType) + (post?.content ?? "");
  return await getResponse(prompt);
};

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
        <div className="flex items-center gap-2">
          {post?.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          <div>Sentiment - {analyzeSentiment(post?.content ?? "")?.score}</div>
        </div>
        <div>
          <DropDownMenu>
            <Button
              variant="menuElement"
              onClick={async () => {
                await navigator.clipboard.writeText(post?.content ?? "");
              }}
            >
              Copy text
            </Button>
            {children}
          </DropDownMenu>
        </div>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex h-screen flex-col items-center justify-center gap-12 px-4 py-4">
          {post ? <EditPost initialPost={post} /> : <div>Loading...</div>}

          <div>{handleGetResponse("criticism")}</div>
          <div>{handleGetResponse("insight")}</div>
          <div>{handleGetResponse("boost")}</div>
          <div>{handleGetResponse("tags")}</div>
        </div>
      </main>
    </>
  );
};

export default EntryBody;
