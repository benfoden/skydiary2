"use client";
import { type Post } from "@prisma/client";
import { useState, type SetStateAction } from "react";
import { api } from "~/trpc/react";

export default function EntryBody({ post }: { post: Post }) {
  const [content, setContent] = useState(post?.content);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const updatePost = api.post.update.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: () => {
      setIsSaving(false);
    },
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      updatePost.mutate({ content: newContent, postId: post?.id });
    }, 1000);

    setDebounceTimeout(newTimeout as unknown as SetStateAction<null>);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-12 px-4 pb-4">
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Today..."
        required
        className="min-h-screen w-full resize-none rounded-3xl border-none bg-white/20 px-8 py-4 text-transparent hover:text-[#424245] focus:outline-none active:text-[#424245] sm:max-w-5xl sm:px-16 sm:py-12"
        autoFocus
      />
      <div className="fixed bottom-4 right-4 text-sm font-semibold text-gray-500">
        {isSaving ? "Saving..." : "Saved"}
      </div>
    </div>
  );
}
