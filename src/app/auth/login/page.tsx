"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center md:ml-[15%] md:w-[22rem]">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 text-3xl font-light text-zinc-600">
            <span className="text-4xl font-medium text-white">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded bg-white p-6 shadow-lg">
            <form
              className="[&>div]:last-of-type:hidden"
              action={async (formData) => {
                await signIn("email", {
                  email: formData.get("email") as string,
                  callbackUrl: "/home",
                });
              }}
            >
              <label className="text-base font-light text-neutral-800">
                email
                <input
                  className="block w-full flex-1 rounded-md border border-gray-200 p-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
                  required
                  data-1p-ignore
                  placeholder="email"
                  name="email"
                  type="email"
                />
              </label>
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center space-x-2 rounded bg-zinc-800 px-4 text-base font-light text-white transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
              >
                <span>sign in with email</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
