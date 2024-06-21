import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import { type EmailDetails } from "~/utils/types";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // todo:lots of dumb errors ignored
//   // @ts-expect-error great
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//   let locale: string = req?.cookies?.get("NEXT_LOCALE")?.value;

//   if (!locale) {
//     locale = "en";
//   }

//   const t = await getTranslations({ locale, namespace: "email" });

//   const emailDetails: EmailDetails = {
//     subject: t("auth.subject"),
//     text: t("auth.text"),
//     body: t("auth.body"),
//     code: t("auth.code"),
//     goBack: t("auth.goBack"),
//     safelyIgnore: t("auth.safelyIgnoreIt"),
//   };

//   return await NextAuth(req, res, authOptions(emailDetails));
// };
