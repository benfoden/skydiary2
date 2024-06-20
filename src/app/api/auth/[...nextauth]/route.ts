/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "~/server/auth";
import { type EmailDetails } from "~/utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // todo:lots of dumb errors ignored
  // @ts-expect-error great
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  let locale: string = req?.cookies?.get("NEXT_LOCALE")?.value;

  if (!locale) {
    locale = "en";
  }

  const t = await getTranslations({ locale, namespace: "email" });

  const emailDetails: EmailDetails = {
    subject: t("auth.subject"),
    text: t("auth.text"),
    body: t("auth.body"),
    code: t("auth.code"),
    goBack: t("auth.goBack"),
    safelyIgnore: t("auth.safelyIgnoreIt"),
  };

  return await NextAuth(req, res, authOptions(emailDetails));
};
export { handler as GET, handler as POST };
