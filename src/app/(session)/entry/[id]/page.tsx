import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import GetAdviceButton from "~/app/_components/GetAdviceButton";
import GetTagsButton from "~/app/_components/GetTagsButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { getResponse } from "~/server/api/ai";
import { api } from "~/trpc/server";
import {
  TAGS,
  generateCoachPrompt,
  generateCommentPrompt,
  generateTagsPrompt,
} from "~/utils/constants";
import { formattedTimeStampToDate } from "~/utils/text";
import EntryBody from "./EntryBody";

export default async function Entry({ params }: { params: { id: string } }) {
  const [post, comments, tags] = await Promise.all([
    api.post.getByPostId({ postId: params.id }),
    api.comment.getCommentsByPostId({ postId: params.id }),
    api.tag.getByPostId({ postId: params.id }),
  ]);

  if (!post) return null;

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>{formattedTimeStampToDate(post?.createdAt)}</h1>

        <DropDownMenu>
          <CopyTextButton text={post?.content} />
          <form
            action={async () => {
              "use server";
              await api.post.delete({ postId: post?.id });
              revalidatePath("/home");
              redirect("/home");
            }}
          >
            <DeleteButton />
          </form>
        </DropDownMenu>
      </SessionNav>
      <div className="flex h-full flex-col items-center px-4 pb-4">
        {post && <EntryBody post={post} />}
        <div className="flex w-full max-w-5xl flex-col items-center gap-4">
          <form
            action={async () => {
              "use server";
              try {
                const tags = await getResponse(
                  generateTagsPrompt + post?.content,
                );

                const tagContents = tags?.split(",").map((tag) => tag.trim());
                const tagIds = tagContents
                  ?.map((content) => {
                    const tag = TAGS.find((tag) => tag.content === content);
                    return tag?.id ?? undefined;
                  })
                  .filter((tag): tag is string => tag !== undefined);
                if (tagIds?.length) {
                  await api.post.addTags({
                    postId: post?.id,
                    tagIds: tagIds,
                  });
                } else {
                  console.error("Failed to tag.");
                }
              } catch (error) {
                console.error("Error creating tags:", error);
              }
            }}
          >
            <GetTagsButton />
          </form>
          <div className="flex w-full flex-row items-center justify-center gap-4">
            {tags && (
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner />
                  </div>
                }
              >
                {tags.map((tag) => (
                  <Link key={tag.id} href={`/topics/${tag.content}/${tag.id}`}>
                    <Button variant="chip">{tag.content}</Button>
                  </Link>
                ))}
              </Suspense>
            )}
          </div>
          <div className="flex h-full w-full flex-col items-center pb-4">
            <div className="flex w-full flex-row items-center justify-center">
              <form
                action={async () => {
                  "use server";
                  try {
                    const coachVariant = await getResponse(
                      generateCoachPrompt + post?.content,
                    );
                    const prompt =
                      generateCommentPrompt(coachVariant!) + post?.content;
                    const response = await getResponse(prompt);
                    if (response) {
                      await api.comment.create({
                        content: response,
                        postId: post?.id,
                        coachVariant: coachVariant!,
                      });
                    } else {
                      console.error(
                        "Failed to get a response for the comment.",
                      );
                    }
                  } catch (error) {
                    console.error("Error creating comment:", error);
                  }
                }}
              >
                <GetAdviceButton />
              </form>
            </div>
            {comments && (
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center font-light">
                    <Spinner />
                  </div>
                }
              >
                <ul>
                  {comments
                    .sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                    )
                    .map((comment) => (
                      <li
                        key={comment.id}
                        className="flex flex-col rounded-lg p-4"
                      >
                        <Card>
                          <div className="flex w-full flex-col gap-4 pt-4">
                            <div className="flex w-full justify-between gap-4 text-xs">
                              <div className="font-medium">
                                {comment.coachVariant}
                              </div>
                              <div>
                                {formattedTimeStampToDate(comment.createdAt)}
                              </div>
                            </div>
                            <div className="max-w-md text-sm">
                              {comment.content}
                            </div>
                          </div>
                        </Card>
                      </li>
                    ))}
                </ul>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
