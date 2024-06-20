import NextAuth from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "~/server/auth";
import { type EmailDetails } from "~/utils/types";

const handler = async () => {
  const t = await getTranslations();

  const emailDetails: EmailDetails = {
    text: t("email.auth.text"),
    subject: t("email.auth.subject"),
    body: t("email.auth.body"),
    code: t("email.auth.code"),
    goBack: t("email.auth.go back"),
    safelyIgnore: t("email.auth.safely ignore it"),
  };

  // Insert any logic here before NextAuth is called

  const options = authOptions(emailDetails);
  return NextAuth(options);
};

export { handler as GET, handler as POST };
