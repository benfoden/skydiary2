import AdviceButton from "~/app/_components/AdviceButton";
import DeleteButton from "~/app/_components/DeleteButton";
import EntryBody from "~/app/_components/EntryBody";
import EntryNav from "~/app/_components/EntryNav";
import { api } from "~/trpc/server";

export default async function Entry({ params }: { params: { id: string } }) {
  const post = await api.post.getByPostId({ postId: params.id });
  const comments = await api.comment.getCommentsByPostId({ postId: params.id });

  console.log("comments", comments);

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <EntryNav post={post}>
        <DeleteButton postId={post?.id ?? ""} />
      </EntryNav>
      <EntryBody post={post} comments={comments}>
        <div className="flex flex-row gap-4">
          <AdviceButton
            postId={post?.id}
            postContent={post?.content}
            coachVariant="criticism"
          />
          <AdviceButton
            postId={post?.id}
            postContent={post?.content}
            coachVariant="insight"
          />
          <AdviceButton
            postId={post?.id}
            postContent={post?.content}
            coachVariant="boost"
          />
        </div>
      </EntryBody>
    </>
  );
}
