import Button from "~/app/_components/Button";

export default function EmailSignin({
  searchParams,
}: {
  searchParams: { token: string; callbackUrl: string; email: string };
}) {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <form
              className="flex w-full flex-col items-center gap-4"
              action="/api/auth/callback/email"
              method="get"
            >
              <p className="text-sm">enter code from the email to log in</p>
              <input
                className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                required
                placeholder="012345"
                name="token"
                type="text"
              />
              {/* <input
                type="hidden"
                name="callbackUrl"
                value={searchParams.callbackUrl}
              /> */}
              <input type="hidden" name="email" value={searchParams.email} />
              <Button variant="submit">log in</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
