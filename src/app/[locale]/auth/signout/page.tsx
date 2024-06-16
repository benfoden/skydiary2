"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import Button from "~/app/_components/Button";

function SignoutPageContent() {
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
          <div className="m-8 flex w-full flex-col items-center gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <h1 className="mt-6 text-center text-xl font-light tracking-tight">
              sure you want to sign out?
            </h1>
            <div className="mt-4 flex flex-col gap-3 text-center">
              <Link href="/home">
                <Button variant="cta">go home</Button>
              </Link>
              <div className="text-sm">or</div>
            </div>
            <Button onClick={handleSignout}>
              {isLoading ? "signing out..." : "sign out"}
            </Button>
          </div>
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
