"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import Button from "~/app/_components/Button";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const emailSchema = z.string().email();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    await signIn("email", {
      email,
      callbackUrl: "/home",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="z-20 flex h-dvh w-full items-center justify-center">
        <div className="flex w-80 flex-col items-center justify-center text-xl">
          <h2 className="mb-4 flex items-center space-x-2 font-light text-[#424245]">
            <span className="text-xl font-light text-[#424245]">skydiary</span>
          </h2>
          <div className="m-8 flex w-full flex-col gap-2 rounded-lg bg-white/50 p-6 shadow-lg">
            <form>
              <label className="text-base font-light">
                email
                <input
                  className={`block w-full flex-1 rounded-md px-4 py-3 font-normal transition placeholder:font-light placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm ${isSubmitting && "opacity-50"}`}
                  required
                  placeholder="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <Button
                variant="submit"
                onClick={handleSignIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "signing in..." : "sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
