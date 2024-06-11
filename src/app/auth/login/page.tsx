"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import Button from "~/app/_components/Button";

import { type Provider } from "next-auth/providers/index";
import React, { useCallback, type KeyboardEvent } from "react";

interface VerificationStepProps {
  email: string;
  callbackUrl?: string;
}

/**
 * User has inserted the email and now he can put the verification code
 */
export const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  callbackUrl,
}) => {
  const [code, setCode] = useState("");

  const onReady = useCallback(() => {
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
      email,
    )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
  }, [callbackUrl, code, email]);

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onReady();
      }
    },
    [onReady],
  );

  return (
    <div>
      <h2>Verify email</h2>
      <p>Insert the magic code you received on your email</p>
      <label>
        Magic code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </label>

      <button onClick={onReady}>Go</button>
    </div>
  );
};

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

interface EmailInputProps {
  provider: Provider;
  onSuccess: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ provider, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = useCallback(async () => {
    setLoading(true);
    const res = await signIn("email", {
      email: email,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      if (res?.url) {
        window.location.replace(res.url);
      }
    } else {
      onSuccess(email);
    }
  }, [email, onSuccess]);

  const onKeyPress = useCallback(
    async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        await handleSignin();
      }
    },
    [handleSignin],
  );

  return (
    <div>
      <input
        type="email"
        name="email"
        placeholder="e.g. jane.doe@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyUp={onKeyPress}
      />
      <button disabled={loading}>Next</button>
    </div>
  );
};

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [showTokenStep, setShowTokenStep] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const { heading, message, signin, status } =
    errors[error?.toLowerCase() as ErrorType] ?? errors.default;

  const emailSchema = z.string().email();

  const emailProvider = useMemo(() => {
    return Object.values(providers).filter((provider) => {
      return provider.id !== "email";
    });
  }, []);

  //todo: get providers from server
  // const providers = await getProviders();

  //ref: https://www.ramielcreations.com/nexth-auth-magic-code

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    await signIn("email", {
      email,
      redirect: false,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          {error && (
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
          )}
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            {emailProvider.map((provider) => (
              <EmailInput
                key={provider.id}
                provider={provider}
                onSuccess={(email) => {
                  setEmail(email);
                  setShowTokenStep(true);
                }}
              />
            ))}
            {showTokenStep && <VerificationStep email={email} />}
          </div>
        </div>
      </div>
    </div>
  );
}
