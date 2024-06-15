import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import SignInForm from "./SignInForm";
import VerificationAlert from "./VerificationAlert";

async function authenticationPrecheck(): Promise<void> {
  const session = await getServerAuthSession();
  if (session) return redirect("/home");
}

export default async function SignIn() {
  await authenticationPrecheck();

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <VerificationAlert />
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
