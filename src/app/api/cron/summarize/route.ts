import { api } from "~/trpc/server";

export async function GET() {
  try {
    await api.post.summarizeAllPostsOlderThanToday();
    return Response.json({ message: "Posts summarized successfully." });
  } catch (error) {
    console.error("Error summarizing posts in cron job:", error);
    const { message, stack } = error as Error;
    console.error(message, stack);
    return Response.json({
      error: "Error summarizing posts in cron job:",
      message: message ?? "Unknown error",
      stack: stack ?? "Unknown stack",
    });
  }
}
