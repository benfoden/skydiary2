"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  async function handleOTPVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(code);
    const formattedCallback = encodeURIComponent("/auth/verified");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;
    const response = await fetch(otpRequestURL);

    //todo: why is this required?
    if (response.url.includes("/auth/verified")) {
      router.replace("/home");
    }
    if (!response) {
      router.replace(`/auth/signin?error=Verification`);
    }

    setIsSubmitting(false);
  }

  return (
    <>
      <form onSubmit={handleOTPVerification}>
        <div className="my-8 flex w-full flex-col gap-4 rounded-lg bg-white/50 p-6 text-sm font-light shadow-lg">
          <label>
            {t("auth.passcode")}
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

          <p>{t("auth.check your email")}</p>
          <p>{t("auth.passcode expires")}</p>

          <FormButton
            variant="submit"
            isDisabled={isSubmitting || !code || code.length !== 6}
          >
            {isSubmitting ? t("auth.verifying") : t("auth.verify and continue")}
          </FormButton>
        </div>
      </form>
      <p className="mb-4 text-sm font-light text-[#424245] opacity-80">
        <em>{t("form.or")}</em>
      </p>
      <Link
        href="#"
        className="text-sm font-medium text-[#424245] opacity-80 hover:text-[#424245] hover:opacity-100"
        onClick={() => {
          location.reload();
        }}
      >
        {t("auth.send a new code")}
      </Link>
    </>
  );
}
