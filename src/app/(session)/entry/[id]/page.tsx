import DeleteButton from "~/app/_components/DeleteButton";
import EntryBody from "~/app/_components/EntryBody";
import { api } from "~/trpc/server";

export default async function Entry({ params }: { params: { id: string } }) {
  const post = await api.post.getByPostId({ postId: params.id });

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <EntryBody post={post}>
        <DeleteButton postId={post?.id ?? ""} />
      </EntryBody>
    </>
  );
}
