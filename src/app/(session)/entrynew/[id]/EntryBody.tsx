"use client";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { useTranslations } from "use-intl";
import ButtonSpinner from "~/app/_components/ButtonSpinner";
import { api } from "~/trpc/react";

export default function EntryBody({ postId }: { postId: string }) {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const { isFetching, isLoading, data } = api.post.getByPostId.useQuery({
    postId,
  });

  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      setContent(data?.content ?? "");
    }
  }, [data, isLoading, isFetching]);

  const updatePost = api.post.update.useMutation({
    onMutate: () => {
      setIsSaving(true);
      router.replace(`${window.location.pathname}?s=1`, { scroll: false });
    },
    onSuccess: () => {
      setIsSaving(false);
      router.replace(`${window.location.pathname}`, { scroll: false });
    },
  });

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    setContent(newContent);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      updatePost.mutate({ content: newContent, postId });
    }, 1000);

    setDebounceTimeout(newTimeout as unknown as SetStateAction<null>);

    if (!debounceTimeout) {
      router.push(`${window.location.pathname}?s=1`);
      const routerTimeout = setTimeout(() => {
        setDebounceTimeout(null);
      }, 300);
      setDebounceTimeout(routerTimeout as unknown as SetStateAction<null>);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-12 px-4 pb-4">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        placeholder={
          (!content && isLoading) || isFetching
            ? t("status.loading")
            : t("entry.today")
        }
        className="min-h-[calc(100vh-224px)] w-full resize-none rounded-3xl border-none bg-white/20 px-8 py-4 text-[#424245] focus:outline-none active:text-[#424245] sm:max-w-5xl sm:px-16 sm:py-12"
        autoFocus
        style={{ height: "auto", overflow: "hidden", paddingBottom: "16px" }}
        onInput={adjustTextareaHeight}
      />
      <div className="fixed bottom-1 right-1 text-[#424245]">
        <div className="flex items-center justify-center">
          {isSaving ? (
            <ButtonSpinner />
          ) : (
            <CheckCircledIcon className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}
