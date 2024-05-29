import { redirect } from "next/navigation";
import React from "react";
import { getServerAuthSession } from "~/server/auth";

const VerifyEmailPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4 p-6">
        <div className="flex max-w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white/50 p-6 font-light shadow-lg">
          <h1 className=" text-xl  text-[#424245]">check your email</h1>
          <p>
            a verification link has been sent. you may need to check your spam
            folder
          </p>
          <p>you can close this window now</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
