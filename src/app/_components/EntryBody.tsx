"use client";
import { type Comment, type Post } from "@prisma/client";
import { formattedTimeStampToDate } from "~/utils/text";
import { Card } from "./Card";
import { EditPost } from "./EditPost";

export default function EntryBody({
  post,
  comments,
  children,
}: {
  post: Post;
  comments: Comment[] | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center gap-12 px-4 pb-4">
      {post ? <EditPost initialPost={post} /> : <div>Loading...</div>}
      {children}
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
                      <div className="font-medium">{comment.coachVariant}</div>
                      <div>{formattedTimeStampToDate(comment.createdAt)}</div>
                    </div>
                    <div className="max-w-md text-sm">{comment.content}</div>
                  </div>
                </Card>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
