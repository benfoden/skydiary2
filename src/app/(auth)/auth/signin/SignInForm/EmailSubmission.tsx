"use client";

import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormButton from "~/app/_components/FormButton";

interface Props {
  onSubmit: (email: string) => void;
}

export default function EmailSubmission({ onSubmit }: Props) {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const t = useTranslations();

  async function handleEmailSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await signIn("email", { email, redirect: false });

    if (response?.error) {
      if (response?.url) {
        router.push(response.url);
      } else {
        router.replace(
          `${locale}/auth/signin?error=${encodeURIComponent(response.error)}`,
        );
      }
    } else {
      onSubmit(email);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-black/60">
      <form onSubmit={handleEmailSubmission}>
        <label className="text-base font-light">
          {t("auth.email")}
          <input
            className={`block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm ${isSubmitting && "opacity-50"}`}
            required
            placeholder="email@example.com"
            autoComplete="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <FormButton variant="submit" isDisabled={isSubmitting || !email}>
          {isSubmitting ? t("auth.signing in") : t("auth.sign in")}
        </FormButton>
      </form>
    </div>
  );
}
