"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "~/app/_components/Button";
import Spinner from "~/app/_components/Spinner";

export type ErrorType =
  | "default"
  | "configuration"
  | "accessdenied"
  | "verification";

interface ErrorView {
  status: number;
  heading: string;
  message: JSX.Element;
  signin?: JSX.Element;
}

const SignInButton = ({ signInText }: { signInText: string }) => (
  <div className="flex flex-col items-center gap-3">
    <Link href="/auth/signin">
      <Button variant="cta">{signInText}</Button>
    </Link>
  </div>
);

const ErrorPageContent = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as ErrorType;

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: t("error.default.heading"),
      message: (
        <>
          <p className="mb-3">{t("error.default.message")}</p>
          <Link href="/">
            <Button variant="cta">{t("nav.home")}</Button>
          </Link>
        </>
      ),
    },
    configuration: {
      status: 500,
      heading: t("error.configuration.heading"),
      message: (
        <>
          <p>{t("error.configuration.message")}</p>
          <Button variant="cta">
            <Link href="/">{t("nav.home")}</Link>
          </Button>
        </>
      ),
    },
    accessdenied: {
      status: 403,
      heading: t("error.accessdenied.heading"),
      message: (
        <>
          <p className="mb-4">{t("error.accessdenied.message")}</p>
        </>
      ),
      signin: <SignInButton signInText={t("auth.sign in")} />,
    },
    verification: {
      status: 403,
      heading: t("error.verification.heading"),
      message: (
        <>
          <p>{t("error.verification.message")}</p>
        </>
      ),
      signin: <SignInButton signInText={t("auth.sign in")} />,
    },
  };

  const { heading, message, signin, status } =
    errors[error?.toLowerCase() as ErrorType] ?? errors.default;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-96 flex-col gap-4 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-black/60">
          <h1 className="flex w-full items-center justify-center text-xl font-light">
            {heading}
          </h1>
          <div className="text-center">
            <div className="pb-4 font-bold">{`${status}`}</div>
            <div className="flex flex-col items-center gap-3 text-sm">
              {message}
            </div>
            {signin && <div className="mt-5">{signin}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorPage = () => (
  <Suspense
    fallback={
      <div className="flex h-full w-full items-center justify-center font-light">
        <Spinner />
      </div>
    }
  >
    <ErrorPageContent />
  </Suspense>
);

export default ErrorPage;
