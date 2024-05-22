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
              <p className="text-sm">verification successful</p>
              <input type="hidden" name="token" value={searchParams.token} />
              <input
                type="hidden"
                name="callbackUrl"
                value={searchParams.callbackUrl}
              />
              <input type="hidden" name="email" value={searchParams.email} />
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/70 px-4 text-base font-light transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
              >
                Continue to your homepage
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
