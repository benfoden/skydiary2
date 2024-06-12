"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <form
      onSubmit={handleOTPVerification}
      className="flex w-full flex-col space-y-6"
    >
      <div>
        <input
          id="code"
          name="code"
          type="number"
          minLength={6}
          maxLength={6}
          required
          className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="One time passcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <p className="text-sm">
        Keep in mind, the emailed passcode will expire after{" "}
        <strong>
          <em>3 minutes</em>
        </strong>
      </p>

      <button
        type="submit"
        disabled={isSubmitting || !code || code.length !== 6}
        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
