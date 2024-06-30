import FormButton from "~/app/_components/FormButton";
import { api } from "~/trpc/server";
import { TAGS } from "~/utils/constants";

export default async function SecretTags() {
  const tags = await api.tag.getAll();

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-4">
        <form
          action={async () => {
            "use server";
            try {
              await Promise.all(
                TAGS.map((tag) =>
                  api.tag.create({
                    content: tag.content.trim(),
                  }),
                ),
              );
            } catch (error) {
              console.error("Error creating tags:", error);
            }
          }}
        >
          <FormButton>Update global tags from TAGS constant</FormButton>
        </form>
        {tags && (
          <ul>
            {tags.map((tag) => (
              <li key={tag.id} className="flex flex-col rounded-lg p-2">
                <div className="flex w-full justify-between gap-4 text-xs">
                  <div className="font-medium">{tag.content}</div>
                  <div className="font-medium">{tag.id}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
