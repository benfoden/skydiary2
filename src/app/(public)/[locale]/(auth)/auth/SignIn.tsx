import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function SignIn() {
  const t = useTranslations("auth");

  // Somehow, if navigating via `<Link />`, the client-side router might reuse the
  // markup of a previously visited `/app` route. If the locale has changed in the
  // meantime, we want to be sure that we're using the latest locale. Using a form
  // and Server Action instead seems to be reliable, but in exchange the browser
  // hard-reloads the page (for unknown reasons).
  async function loginAction() {
    "use server";
    redirect("/home");
  }

  return (
    <form action={loginAction}>
      <button type="submit">{t("sign in")}</button>
    </form>
  );
}
