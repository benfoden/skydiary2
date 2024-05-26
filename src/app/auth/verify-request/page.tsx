import React from "react";

const VerifyEmailPage: React.FC = async () => {
  // const session = await getServerAuthSession();

  // if (session) {
  //   redirect("/");
  // }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white/50 p-6 font-light shadow-lg">
          <h1 className=" text-xl  text-[#424245]">
            check your email for skydiary
          </h1>
          <div>
            A log in link has been sent for secure access without a password.
            <br />
            <br />
            You may close this window.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
