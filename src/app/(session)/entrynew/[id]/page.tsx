"use client";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import ButtonSpinner from "~/app/_components/ButtonSpinner";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { api } from "~/trpc/react";
import { formattedTimeStampToDate } from "~/utils/text";

export default function Entry({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { s: string };
}) {
  // const [comments, tags, personas] = await Promise.all([
  //   api.comment.getCommentsByPostId({ postId: params.id }),
  //   api.tag.getByPostId({ postId: params.id }),
  //   api.persona.getAllByUserId(),
  // ]);

  const t = useTranslations();
  const [content, setContent] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const postId = params.id;

  const router = useRouter();

  const {
    isFetching,
    isLoading,
    data: post,
  } = api.post.getByPostId.useQuery({
    postId,
  });

  useEffect(() => {
    if (!isLoading && !isFetching && post) {
      setContent(post?.content);
    }
  }, [post, isLoading, isFetching]);

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

  if (!post) return null;
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft
            targetPathname={"/home"}
            label={t("nav.home")}
            isDisabled={searchParams.s === "1"}
          />
        </div>
        <h1>{formattedTimeStampToDate(post.createdAt)}</h1>

        <DropDownMenu>
          <CopyTextButton text={post?.content} />
          {/* <form
            action={() => {
              api.post.delete({ postId: post?.id });
              revalidatePath("/home");
              redirect("/home");
            }}
          >
            <DeleteButton />
          </form> */}
        </DropDownMenu>
      </SessionNav>
      <div className="flex h-full flex-col items-center px-4 pb-4">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Spinner />
            </div>
          }
        >
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
              style={{
                height: "auto",
                overflow: "hidden",
                paddingBottom: "16px",
              }}
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
        </Suspense>
        {/* <div className="flex w-full max-w-5xl flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <form
              action={async () => {
                "use server";
                try {
                  if (searchParams.s === "1") {
                    return;
                  }

                  const tags = await getResponse(generateTagsPrompt + content);

                  const tagContents = tags?.split(",").map((tag) => tag.trim());
                  const tagIds = tagContents
                    ?.map((content) => {
                      const tag = TAGS.find((tag) => tag.content === content);
                      return tag?.id ?? undefined;
                    })
                    .filter((tag): tag is string => tag !== undefined);
                  if (tagIds?.length) {
                    await serverApi.post.addTags({
                      postId: params?.id,
                      tagIds: tagIds,
                    });
                  } else {
                    console.error("Failed to tag.");
                  }

                  const latestPersona =
                    await serverApi.persona.getUserPersona();
                  const generatedPersona = await getResponseJSON(
                    generatePersonaPrompt(latestPersona ?? NEWPERSONAUSER) +
                      content,
                  );

                  if (typeof generatedPersona === "string") {
                    const personaObject = JSON.parse(
                      generatedPersona,
                    ) as Persona;
                    await serverApi.persona.update({
                      personaId: latestPersona?.id ?? "",
                      name: latestPersona?.name ?? "",
                      description: personaObject?.description ?? "",
                      image: latestPersona?.image ?? "",
                      age: personaObject?.age ?? 0,
                      gender: personaObject?.gender ?? "",
                      relationship: personaObject?.relationship ?? "",
                      occupation: personaObject?.occupation ?? "",
                      traits: personaObject?.traits ?? "",
                      communicationStyle:
                        personaObject?.communicationStyle ?? "",
                      communicationSample:
                        personaObject?.communicationSample ?? "",
                    });
                  }
                } catch (error) {
                  console.error("Error creating tags:", error);
                } finally {
                  if (!error) revalidatePath(`/entry/${params.id}`);
                }
              }}
            >
              <FormButton isDisabled={searchParams.s === "1"}>
                <FrameIcon className="h-5 w-5" />
              </FormButton>
            </form>
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
            <div className="flex w-full flex-row items-center justify-center gap-2">
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

                    const currentUserPersona =
                      await api.persona.getUserPersona();
                    let updatedContent = "";
                    if (currentUserPersona) {
                      updatedContent =
                        latestPost?.content +
                        "End of journal entry. When writing your response, also consider that this journal entry was written by the following person: " +
                        JSON.stringify(currentUserPersona);
                    }

                    const coachVariant = await getResponse(
                      generateCoachPrompt + latestPost?.content,
                    );
                    const prompt =
                      generateCommentPrompt(coachVariant!) + updatedContent ??
                      latestPost?.content;

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
                <FormButton isDisabled={searchParams.s === "1"}>
                  <ChatBubbleIcon className="h-5 w-5" />
                </FormButton>
              </form>
              {personas.map((persona) => (
                <form
                  key={persona.id}
                  action={async () => {
                    "use server";
                    if (searchParams.s === "1") {
                      return;
                    }
                    try {
                      const latestPost = await api.post.getByPostId({
                        postId: params.id,
                      });

                      const currentUserPersona =
                        await api.persona.getUserPersona();

                      let updatedContent = "";
                      if (currentUserPersona) {
                        updatedContent =
                          latestPost?.content +
                          "End of journal entry. When writing your response, also consider that this journal entry was written by the following person: " +
                          JSON.stringify(currentUserPersona);
                      }

                      const response = await getResponse(
                        personaPrompt(persona) + updatedContent ??
                          latestPost?.content,
                      );
                      if (response) {
                        await api.comment.create({
                          content: response,
                          postId: params?.id,
                          createdByPersonaId: persona.id,
                          coachVariant: persona.name,
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
                  <FormButton isDisabled={searchParams.s === "1"}>
                    <div className="flex flex-row items-center gap-2 font-medium">
                      {persona.image ? (
                        <>
                          <Image
                            alt={persona.name}
                            src={persona.image}
                            width="16"
                            height="16"
                            className="rounded-full"
                          />
                          <span className="text-xs">{persona.name}</span>
                        </>
                      ) : (
                        <>
                          <PersonIcon className="h-4 w-4" />
                          <span className="text-xs">{persona.name}</span>
                        </>
                      )}
                    </div>
                  </FormButton>
                </form>
              ))}
              <Link href="/persona/all">
                <Button>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </Link>
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
                        <Card isButton={false}>
                          <div className="flex w-full flex-col gap-4 py-4">
                            <div className="flex w-full justify-between gap-4 text-xs">
                              <div className="font-medium">
                                <PersonaIcon
                                  personaId={comment.createdByPersonaId}
                                  personas={personas}
                                  coachVariant={comment.coachVariant ?? ""}
                                />
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
        </div> */}
      </div>
    </>
  );
}
