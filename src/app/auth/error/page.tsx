"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "~/app/_components/Button";

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

const SignInButton = () => (
  <div className="flex flex-col items-center gap-3">
    <Link href="/auth/signin">
      <Button variant="cta">sign in again</Button>
    </Link>
  </div>
);

const ErrorPageContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as ErrorType;

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <>
          <p className="mb-3">an unindentified error has occured.</p>
          <Link href="/">
            <Button variant="cta">go back to top page</Button>
          </Link>
        </>
      ),
    },
    configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <>
          <p>there is a problem with the server. please try again later</p>
          <p className="leading-8">if this continues, please contact us</p>
          <Button variant="cta">
            <Link href="/">go back to top page</Link>
          </Button>
        </>
      ),
    },
    accessdenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <>
          <p className="mb-4">you do not have permission</p>
        </>
      ),
      signin: <SignInButton />,
    },
    verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <>
          <p>the sign in link is no longer valid</p>
          <p>it may have been used already or it may have expired</p>
        </>
      ),
      signin: <SignInButton />,
    },
  };

  const { heading, message, signin, status } =
    errors[error?.toLowerCase() as ErrorType] ?? errors.default;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-96 flex-col gap-4 rounded-lg bg-white/50 p-6 shadow-lg">
          <h1 className="flex w-full items-center justify-center text-xl font-light text-[#424245]">
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
        Loading...
      </div>
    }
  >
    <ErrorPageContent />
  </Suspense>
);

export default ErrorPage;
