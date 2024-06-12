"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  onSubmit: (email: string) => void;
}

export default function EmailSubmission({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleEmailSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await signIn("email", { email, redirect: false });
    if (response?.error) {
      if (response?.url) {
        router.push(response.url);
      } else {
        router.replace(
          `/auth/signin?error=${encodeURIComponent(response.error)}`,
        );
      }
    } else {
      onSubmit(email);
    }

    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleEmailSubmission}
      className="flex w-full flex-col space-y-6"
    >
      <div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Sending email..." : "Sign in / Sign up"}
      </button>
    </form>
  );
}
