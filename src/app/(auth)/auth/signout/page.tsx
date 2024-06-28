"use client";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";

function SignoutPageContent() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl")!;

  const handleSignout = useCallback(async () => {
    setIsLoading(true);
    await signOut({
      callbackUrl: callbackUrl || "/",
    });

    setIsLoading(false);
  }, [callbackUrl]);

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center">
          <h1 className="mb-8 text-xl font-light">{t("auth.sign out")}</h1>
          <Card variant="form">
            <div className="mt-4 flex w-full flex-col gap-4 text-center">
              <Link href="/home">
                <Button variant="submit">{t("auth.back to home")}</Button>
              </Link>
              <div className="text-sm">{t("form.or")}</div>
            </div>
            <Button
              variant="submit"
              onClick={handleSignout}
              disabled={isLoading}
            >
              {isLoading ? t("auth.signing out") : t("auth.sign out")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

const SignOutPage = () => (
  <Suspense
    fallback={
      <div className="flex h-full w-full items-center justify-center font-light">
        Loading...
      </div>
    }
  >
    <SignoutPageContent />
  </Suspense>
);

export default SignOutPage;
