import AuthFeedbackMessage from "@components/AuthFeedbackMessage";
import MetaTags from "@components/MetaTags";
import { getServerAuthSession } from "@server/utils/auth";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

const VerifyEmailPage: React.FC = () => {
  return (
    <>
      <MetaTags title="Link sent to your e-mail" />
      <div className="relative pb-5 shadow sm:pb-0 dark:bg-zinc-800 dark:shadow-2xl">
        <AuthFeedbackMessage message="E-mail sent" type="success" />
        <div className="p-6 text-center">
          <h1 className="mx-2 mt-6 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
            E-mail sent to your e-mail address.
          </h1>

          <p className="mt-4">
            Check your inbox for your magic link. It provides a{" "}
            <span className="italic text-emerald-600 dark:text-emerald-400">
              password-less{" "}
            </span>
            access to your account.
          </p>

          <div className="mt-5">
            <Link
              href="/"
              className="cursor-pointer text-center text-emerald-600 underline hover:text-emerald-500 dark:text-emerald-400"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req, res });

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}
