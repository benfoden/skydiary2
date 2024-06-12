import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import LogInForm from "./LogInForm";
import VerificationAlert from "./VerificationAlert";

async function authenticationPrecheck(): Promise<void> {
  const session = await getServerAuthSession();
  if (session?.user) return redirect("/home");
}

export default async function LogIn() {
  // await authenticationPrecheck();

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <VerificationAlert />
            <LogInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
