"use client";

import { type Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function EditPost({ initialPost }: { initialPost: Post }) {
  const router = useRouter();
  const [content, setContent] = useState(initialPost?.content);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const updatePost = api.post.update.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: () => {
      router.refresh();
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
      updatePost.mutate({ content: newContent, postId: initialPost.id });
    }, 1000);

    setDebounceTimeout(newTimeout as never);
  };

  return (
    <>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="h-full w-full resize-none rounded-3xl border-none bg-white/20 px-8 py-4 text-lg leading-loose focus:outline-none sm:px-16 sm:py-12"
        autoFocus
      />
      <div className="absolute bottom-4 right-4 text-sm font-semibold text-gray-500">
        {isSaving ? "Saving..." : "Saved"}
      </div>
    </>
  );
}
