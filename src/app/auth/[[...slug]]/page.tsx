"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/30 p-6 shadow-lg">
            <form
              className="[&>div]:last-of-type:hidden"
              action={async (formData) => {
                await signIn("email", {
                  email: formData.get("email") as string,
                  callbackUrl: "/home",
                });
              }}
            >
              <label className="text-base font-light">
                email
                <input
                  className="block w-full flex-1 rounded-md p-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                  data-1p-ignore
                  placeholder="email"
                  name="email"
                  type="email"
                />
              </label>
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-white/80 px-4 text-base font-light transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
              >
                <span>send me a link</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
