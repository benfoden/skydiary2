import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string(),
    DATABASE_ENCRYPTION_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_FROM: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    OPENAI_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_SECRET_KEY_TEST: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY_TEST: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    PRODUCT_ID_BASE_TEST: z.string(),
    PRICE_ID_BASE_MONTHLY_TEST: z.string(),
    PRICE_ID_BASE_YEARLY_TEST: z.string(),
    PRODUCT_ID_BASE: z.string(),
    PRICE_ID_BASE_MONTHLY: z.string(),
    PRICE_ID_BASE_YEARLY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    DATABASE_ENCRYPTION_KEY: process.env.DATABASE_ENCRYPTION_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_SECRET_KEY_TEST: process.env.STRIPE_SECRET_KEY_TEST,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_PUBLISHABLE_KEY_TEST: process.env.STRIPE_PUBLISHABLE_KEY_TEST,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    PRODUCT_ID_BASE_TEST: process.env.PRODUCT_ID_BASE_TEST,
    PRICE_ID_BASE_MONTHLY_TEST: process.env.PRICE_ID_BASE_MONTHLY_TEST,
    PRICE_ID_BASE_YEARLY_TEST: process.env.PRICE_ID_BASE_YEARLY_TEST,
    PRODUCT_ID_BASE: process.env.PRODUCT_ID_BASE,
    PRICE_ID_BASE_MONTHLY: process.env.PRICE_ID_BASE_MONTHLY,
    PRICE_ID_BASE_YEARLY: process.env.PRICE_ID_BASE_YEARLY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
