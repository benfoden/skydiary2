"use server";
import { type Persona, type Tag } from "@prisma/client";
import {
  AvatarIcon,
  CircleIcon,
  FrameIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import CopyTextButton from "~/app/_components/CopyTextButton";
import DeleteButton from "~/app/_components/DeleteButton";
import DropDownMenu from "~/app/_components/DropDown";
import FormButton from "~/app/_components/FormButton";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { PersonaIcon } from "~/app/_components/PersonaIcon";
import { SessionNav } from "~/app/_components/SessionNav";
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
  const [t, locale, post, comments, tags, personas, userPersona] =
    await Promise.all([
      getTranslations(),
      getUserLocale(),
      api.post.getByPostId({ postId: params.id }),
      api.comment.getCommentsByPostId({ postId: params.id }),
      api.tag.getByPostId({ postId: params.id }),
      api.persona.getAllByUserId(),
      api.persona.getUserPersona(),
    ]);

  if (!post) {
    console.error("Failed to get post.");
    return notFound();
  }

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
      <div className="flex h-full flex-col items-center px-2 pb-4 sm:px-8">
        <EntryBody post={post} />
        <div className="flex w-full max-w-5xl flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <ul className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
              {tags?.map((tag: Tag) => (
                <li key={tag.id}>
                  <Link href={`/topics/${tag.content}/${tag.id}`}>
                    <Button variant="text">
                      <span className="text-xs font-medium">{tag.content}</span>
                    </Button>
                  </Link>
                </li>
              ))}
              <li>
                {!tags.length && (
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
                        if (!latestPost?.content) {
                          return;
                        }

                        const newTags = await getResponse(
                          generateTagsPrompt + latestPost?.content,
                        );

                        if (newTags) {
                          const tagContents = newTags
                            ?.split(",")
                            .map((tag) => tag.trim());

                          const tagIds = tagContents
                            ?.map((content) => {
                              const tag = TAGS.find(
                                (tag) => tag.content === content,
                              );
                              return tag?.id ?? undefined;
                            })
                            .filter((tag): tag is string => tag !== undefined);
                          if (tagIds?.length) {
                            await api.post.addTags({
                              postId: params?.id,
                              tagIds: tagIds,
                            });
                          }
                        } else {
                          console.error("Failed to tag.");
                        }
                        const generatedPersona = await getResponseJSON(
                          generatePersonaPrompt(userPersona ?? NEWPERSONAUSER) +
                            latestPost?.content,
                        );

                        if (
                          generatedPersona &&
                          typeof generatedPersona === "string"
                        ) {
                          const personaObject = JSON.parse(
                            generatedPersona,
                          ) as Persona;
                          await api.persona.update({
                            personaId: userPersona?.id ?? "",
                            name: userPersona?.name ?? "",
                            description: personaObject?.description ?? "",
                            image: userPersona?.image ?? "",
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
                          revalidatePath(`/entry/${params.id}`);
                        }
                      } catch (error) {
                        console.error("Error creating tags:", error);
                      }
                    }}
                  >
                    <FormButton isDisabled={searchParams.s === "1"}>
                      <FrameIcon className="h-5 w-5" />
                    </FormButton>
                  </form>
                )}
              </li>
            </ul>
          </div>
          <div className="flex h-full w-full flex-col items-center pb-4">
            <div className="flex w-full flex-row items-start justify-center gap-2">
              <ul className="flex w-full flex-row flex-wrap justify-start gap-2">
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
                      if (!latestPost?.content) {
                        return;
                      }

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
                    <div className="flex flex-row items-center gap-2 text-xs">
                      <CircleIcon className="h-4 w-4" />
                      sky
                    </div>
                  </FormButton>
                </form>
                {personas.map((persona: Persona) => (
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
              </ul>
              <div className="flex w-fit flex-row items-center justify-end gap-2">
                <DropDownMenu>
                  <Link href="/persona/all">
                    <Button variant="menuElement">
                      <AvatarIcon className="h-5 w-5" />
                      personas
                    </Button>
                  </Link>
                </DropDownMenu>
              </div>
            </div>

            {comments && (
              <ul className="w-[420px]">
                {comments
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
          </div>
        </div>
      </div>
    </>
  );
}
