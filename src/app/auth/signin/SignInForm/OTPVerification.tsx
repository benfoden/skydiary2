"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormButton from "~/app/_components/FormButton";

interface Props {
  email: string;
}

export default function OTPVerification({ email }: Props) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleOTPVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(code);
    const formattedCallback = encodeURIComponent("/home");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;
    const response = await fetch(otpRequestURL);

    if (response) {
      if (response.url.includes("/private")) {
        router.push(response.url);
      } else {
        router.replace(`/auth/signin?error=Verification`);
      }
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <form onSubmit={handleOTPVerification}>
        <div className="my-8 flex w-full flex-col gap-4 rounded-lg bg-white/50 p-6 text-sm font-light shadow-lg">
          <label>
            passcode
            <input
              id="code"
              name="code"
              type="number"
              minLength={6}
              maxLength={6}
              required
              className="block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
              placeholder="one time passcode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          <p>your code expires in 5 minutes</p>

          <FormButton
            variant="submit"
            isDisabled={isSubmitting || !code || code.length !== 6}
          >
            {isSubmitting ? "verifying..." : "verify"}
          </FormButton>
        </div>
      </form>
      <p className="mb-4 text-sm font-light text-[#424245] opacity-80">
        <em>or</em>
      </p>
      <Link
        href="#"
        className="text-sm font-medium text-[#424245] opacity-80 hover:text-[#424245] hover:opacity-100"
        onClick={() => {
          location.reload();
        }}
      >
        get a new code
      </Link>
    </>
  );
}
