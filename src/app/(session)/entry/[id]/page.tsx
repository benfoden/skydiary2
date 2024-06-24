"use server";
import { type Persona } from "@prisma/client";
import {
  ChatBubbleIcon,
  DotsHorizontalIcon,
  FrameIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { error } from "console";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { PersonaIcon } from "~/app/_components/PersonaIcon";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";
import { getUserLocale } from "~/i18n";
import { getResponse, getResponseJSON } from "~/server/api/ai";
import { api } from "~/trpc/server";
import {
  NEWPERSONAUSER,
  TAGS,
  generateCoachPrompt,
  generateCommentPrompt,
  generatePersonaPrompt,
  generateTagsPrompt,
  personaPrompt,
} from "~/utils/constants";
import { formattedTimeStampToDate } from "~/utils/text";
import EntryBody from "./EntryBody";

export default async function Entry({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { s: string };
}) {
  const [t, locale, post, comments, tags, personas] = await Promise.all([
    getTranslations(),
    getUserLocale(),
    api.post.getByPostId({ postId: params.id }),
    api.comment.getCommentsByPostId({ postId: params.id }),
    api.tag.getByPostId({ postId: params.id }),
    api.persona.getAllByUserId(),
  ]);

  if (!post) return console.error("Failed to get post.");

  return (
    <>
      <SessionNav>
        <NavChevronLeft
          targetPathname={"/home"}
          label={t("nav.home")}
          isDisabled={searchParams.s === "1"}
        />
        <h1>{formattedTimeStampToDate(post.createdAt, locale)}</h1>

        <DropDownMenu>
          <CopyTextButton text={post.content} />
          <form
            action={async () => {
              "use server";
              await api.post.delete({ postId: post?.id });
              revalidatePath("/home");
              redirect("/home");
            }}
          >
            <DeleteButton />
          </form>
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
            <form
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
                    generateTagsPrompt + latestPost?.content,
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
                      latestPost?.content,
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
