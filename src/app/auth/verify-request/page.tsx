import { redirect } from "next/navigation";
import React from "react";
import FormButton from "~/app/_components/FormButton";
import { getServerAuthSession } from "~/server/auth";

const VerifyEmailPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4 p-6">
        <h1 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
          <span className="text-xl font-light text-[#424245]">skydiary</span>
        </h1>
        <div className="flex max-w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white/40 p-6 text-sm shadow-lg">
          <p>
            a log in code has been sent. you may need to check your spam folder
          </p>
          <form
            action={async () => {
              "use server";
              redirect("/auth/email");
            }}
          >
            <FormButton variant="submit">continue and enter code</FormButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
