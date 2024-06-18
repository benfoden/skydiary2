import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "~/server/auth";
import { type EmailDetails } from "~/utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const t = await getTranslations();

      const emailDetails: EmailDetails = {
        text: t("email.auth.text"),
        subject: t("email.auth.subject"),
        body: t("email.auth.body"),
        code: t("email.auth.code"),
        goBack: t("email.auth.go back"),
        safelyIgnore: t("email.auth.safely ignore it"),
      };
      await NextAuth(req, res, authOptions(emailDetails));
    } else {
      await NextAuth(req, res, authOptions());
    }
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

export { handler as GET, handler as POST };
