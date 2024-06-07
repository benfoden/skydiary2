import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import GetCommentButton from "~/app/_components/GetCommentButton";
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

export default async function Entry({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { s: string };
}) {
  const post = await api.post.getByPostId({ postId: params.id });
  if (!post) return null;

  const [comments, tags] = await Promise.all([
    api.comment.getCommentsByPostId({ postId: params.id }),
    api.tag.getByPostId({ postId: params.id }),
  ]);

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft
            targetPathname={"/home"}
            label={"home"}
            isDisabled={searchParams.s === "1"}
          />
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
                if (searchParams.s === "1") {
                  return;
                }
                const latestPost = await api.post.getByPostId({
                  postId: params.id,
                });
                const tags = await getResponse(
                  generateTagsPrompt + latestPost?.content,
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
                    postId: params?.id,
                    tagIds: tagIds,
                  });
                  revalidatePath(`/entry/${params.id}`);
                } else {
                  console.error("Failed to tag.");
                }
              } catch (error) {
                console.error("Error creating tags:", error);
              }
            }}
          >
            <GetTagsButton isDisabled={searchParams.s === "1"} />
          </form>
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              {tags && (
                <ul className="flex flex-row gap-2">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Link href={`/topics/${tag.content}/${tag.id}`}>
                        <Button variant="chip">{tag.content}</Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Suspense>
          </div>
          <div className="flex h-full w-full flex-col items-center pb-4">
            <div className="flex w-full flex-row items-center justify-center">
              <form
                action={async () => {
                  "use server";
                  if (searchParams.s === "1") {
                    return;
                  }
                  try {
                    const latestPost = await api.post.getByPostId({
                      postId: params.id,
                    });

                    const coachVariant = await getResponse(
                      generateCoachPrompt + latestPost?.content,
                    );
                    const prompt = generateCommentPrompt(
                      coachVariant!,
                      latestPost?.content ?? "",
                    );
                    const response = await getResponse(prompt);
                    if (response) {
                      await api.comment.create({
                        content: response,
                        postId: params?.id,
                        coachVariant: coachVariant!,
                      });
                      revalidatePath(`/entry/${params.id}`);
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
                <GetCommentButton isDisabled={searchParams.s === "1"} />
              </form>
            </div>
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center font-light">
                  <Spinner />
                </div>
              }
            >
              {comments && (
                <ul className="w-[420px]">
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
                          <div className="flex w-full flex-col gap-4 py-4">
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
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
