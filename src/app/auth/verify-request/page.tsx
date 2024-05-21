import React from "react";

const VerifyEmailPage: React.FC = async () => {
  // const session = await getServerAuthSession();

  // if (session) {
  //   redirect("/");
  // }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-96 flex-col gap-4 rounded-lg bg-white/50 p-6 shadow-lg">
          <h1 className="flex w-full items-center justify-center text-xl font-light text-[#424245]">
            check your email
          </h1>
          <p className="font-light">
            A sign in link has been sent to your email address. <br />
            <br />
            It provides secure access to your skydiary account without a
            password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
