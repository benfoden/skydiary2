"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as ErrorType;

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <div className="flex flex-col items-center gap-3">
          <p className="mb-3">an unindentified error has occured.</p>
          <Link href="/">
            <Button variant="cta">back to top page</Button>
          </Link>
        </div>
      ),
    },
    configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <div className="flex flex-col items-center gap-3">
          <p>there is a problem with the server configuration.</p>
          <p className="leading-8">
            please tell us to check the server logs for more information.
          </p>
        </div>
      ),
    },
    accessdenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <div className="flex flex-col items-center gap-3">
          <p className="mb-4">you do not have permission to sign in.</p>
          <Link href="/auth/signin">sign in</Link>
        </div>
      ),
    },
    verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <div className="flex flex-col items-center gap-3">
          <p>the sign in link is no longer valid.</p>
          <p>it may have been used already or it may have expired.</p>
        </div>
      ),
      signin: <Link href="/auth/signin">sign in</Link>,
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
            <div>{`${status}`}</div>
            <div>{message}</div>
            {signin && <div className="mt-5">{signin}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
