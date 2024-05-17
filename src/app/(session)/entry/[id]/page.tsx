import { Suspense } from "react";
import AdviceButton from "~/app/_components/AdviceButton";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { api } from "~/trpc/server";
import { formattedTimeStampToDate } from "~/utils/text";
import EntryBody from "./EntryBody";

export default async function Entry({ params }: { params: { id: string } }) {
  const post = await api.post.getByPostId({ postId: params.id });
  const comments = await api.comment.getCommentsByPostId({ postId: params.id });
  if (!post) return <div>Loading...</div>;

  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1>{formattedTimeStampToDate(post?.createdAt)}</h1>

        <DropDownMenu>
          <DeleteButton postId={post?.id} />
          <CopyTextButton text={post?.content} />
        </DropDownMenu>
      </SessionNav>
      <Suspense fallback={<Spinner />}>
        <div className="flex h-full flex-col items-center gap-12 px-4 pb-4">
          {post && <EntryBody post={post} />}
          <div className="flex flex-row gap-4">
            <AdviceButton postId={post?.id} postContent={post?.content} />
          </div>
          {comments && (
            <ul>
              {comments
                .slice()
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((comment) => (
                  <li key={comment.id} className="flex flex-col rounded-lg p-4">
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
          )}
        </div>
      </Suspense>
    </>
  );
}
