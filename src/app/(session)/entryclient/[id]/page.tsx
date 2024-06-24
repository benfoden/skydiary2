"use client";
import {
  type Comment,
  type Persona,
  type Post,
  type Tag,
} from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { PersonaIcon } from "~/app/_components/PersonaIcon";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { api } from "~/trpc/react";
import { formattedTimeStampToDate } from "~/utils/text";
import EntryBody from "./EntryBody";

export default function Entry({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { s: string };
}) {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>();
  const [tags, setTags] = useState<Tag[]>();
  const [personas, setPersonas] = useState<Persona[]>();

  const t = useTranslations();

  const { data: postData } = api.post.getByPostId.useQuery({
    postId: params.id,
  });
  const { data: commentsData } = api.comment.getCommentsByPostId.useQuery({
    postId: params.id,
  });
  const { data: tagsData } = api.tag.getByPostId.useQuery({
    postId: params.id,
  });
  const { data: personasData } = api.persona.getAllByUserId.useQuery();

  useEffect(() => {
    if (postData) {
      setPost(postData);
      setComments(commentsData);
      setTags(tagsData);
      setPersonas(personasData);
    }
  }, [postData, commentsData, tagsData, personasData]);

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
          <CopyTextButton text={post.content} />
          <DeleteButton />
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
          <EntryBody postId={params.id} />
        </Suspense>
        <div className="flex w-full max-w-5xl flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center justify-center gap-4">
            {/* <form
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
                    generateTagsPrompt + latestpost.content,
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
                  } else {
                    console.error("Failed to tag.");
                  }

                  const latestPersona = await api.persona.getUserPersona();
                  const generatedPersona = await getResponseJSON(
                    generatePersonaPrompt(latestPersona ?? NEWPERSONAUSER) +
                      latestpost.content,
                  );

                  if (typeof generatedPersona === "string") {
                    const personaObject = JSON.parse(
                      generatedPersona,
                    ) as Persona;
                    await api.persona.update({
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
            </form> */}
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
              {/* <form
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
                        latestpost.content +
                        "End of journal entry. When writing your response, also consider that this journal entry was written by the following person: " +
                        JSON.stringify(currentUserPersona);
                    }

                    const coachVariant = await getResponse(
                      generateCoachPrompt + latestpost.content,
                    );
                    const prompt =
                      generateCommentPrompt(coachVariant!) + updatedContent ??
                      latestpost.content;

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
              </form> */}
              {/* {personas.map((persona) => (
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
                          latestpost.content +
                          "End of journal entry. When writing your response, also consider that this journal entry was written by the following person: " +
                          JSON.stringify(currentUserPersona);
                      }

                      const response = await getResponse(
                        personaPrompt(persona) + updatedContent ??
                          latestpost.content,
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
              ))} */}
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
                                  personaId={comment.createdByPersonaId!}
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
        </div>
      </div>
    </>
  );
}
