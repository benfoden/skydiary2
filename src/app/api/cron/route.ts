export async function GET() {
  // todo:
  // await api.post
  //   .checkAndSummarizeLastPost({ userTimezone, today })
  //   .catch((error) =>
  //     console.error("Error summarizing the last entry:", error),
  //   );

  const result = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Chicago",
    {
      cache: "no-store",
    },
  );
  const data = await result.json();

  return Response.json({ datetime: data.datetime });
}
