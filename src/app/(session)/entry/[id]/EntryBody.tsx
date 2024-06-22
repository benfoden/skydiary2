"use client";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import ButtonSpinner from "~/app/_components/ButtonSpinner";
import { api } from "~/trpc/react";

export default function EntryBody({ postId }: { postId: string }) {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { isFetching, isLoading, data } = api.post.getByPostId.useQuery({
    postId,
  });

  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      setContent(data?.content ?? "");
      textareaRef.current.innerText = data?.content;
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

  // const adjustTextareaHeight = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "auto";
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  //   }
  // };

  const handleContentChange = () => {
    if (textareaRef.current) {
      const newContent = textareaRef.current.innerText;

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
    }
  };

  // useEffect(() => {
  //   if (textAreaRef.current) {
  //     textAreaRef.current.style.height = "auto";
  //     const newHeight =
  //       textAreaRef.current.scrollHeight > 16
  //         ? textAreaRef.current.scrollHeight
  //         : 16;
  //     textAreaRef.current.style.height = newHeight.toString() + "px";
  //   }
  // }, []);

  // useEffect(() => {
  //   if (textAreaRef.current) {
  //     // We need to reset the height momentarily to get the correct scrollHeight for the textarea
  //     textAreaRef.current.style.height = "0px";
  //     const scrollHeight = textAreaRef.current.scrollHeight;

  //     // We then set the height directly, outside of the render loop
  //     // Trying to set this with state or a ref will product an incorrect value.
  //     textAreaRef.current.style.height = scrollHeight + "px";
  //   }
  // }, [textAreaRef, value]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-12 px-4 pb-4">
      <div
        role="textbox"
        aria-multiline="true"
        aria-label="Editable content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        ref={textareaRef}
        className="h-full w-full resize-none rounded-3xl border-none bg-white/20 px-8 py-4 focus:outline-none sm:max-w-5xl sm:px-16 sm:py-12"
        autoFocus
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
