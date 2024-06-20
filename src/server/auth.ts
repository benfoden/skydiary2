/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { randomBytes, randomInt, randomUUID } from "crypto";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { env } from "~/env";

import { db } from "~/server/db";
import { type EmailDetails } from "~/utils/types";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions = (emailDetails?: EmailDetails): NextAuthOptions => ({
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
    newUser: "/auth/new-user",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
      generateSessionToken: () => {
        return randomUUID?.() ?? randomBytes(32).toString("hex");
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      generateVerificationToken() {
        return randomInt(100000, 999999).toString();
      },
      maxAge: 5 * 60,
      async sendVerificationRequest(params) {
        const { identifier: to, provider, token } = params;
        const { server, from } = provider;

        const result = await createTransport(server).sendMail({
          to,
          from,
          subject: emailDetails?.subject,
          text: emailDetails?.text,
          html: `<body style="font-family: sans-serif; background: linear-gradient(to bottom, #cce3f1, #F3F6F6) no-repeat; background-size: cover; color: #424245; padding: 32px 16px; text-align: center;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.4); max-width: 360px; min-height: 360px; margin: auto; border-radius: 10px; vertical-align: middle; padding: 32px 0px;">
                      <tr>
                        <td align="center" style="font-size: 22px; color: #424245; font-weight: 300; padding-bottom: 16px;">${emailDetails?.body}</td>
                      </tr>
                      <tr>
                        <td align="center">
                          <table border="0" cellspacing="0" cellpadding="0" style="margin: auto;">
                          <tr>
                              <td align="center" style="border-radius: 5px; padding-bottom: 16px;">
                                <span style="font-size: 16px;">${emailDetails?.code}</span>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="border-radius: 5px;">
                                <code style="font-size: 22px;">${token}</code>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding-top: 16px;">
                                <p style="font-size: 16px; color: #424245;">${emailDetails?.goBack}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size: 16px; line-height: 22px; color: #424245; padding: 0px 16px; font-weight: 300;">${emailDetails?.safelyIgnore}</td>
                      </tr>
                    </table>
                  </body>`,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions());
