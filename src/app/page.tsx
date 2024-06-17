import { redirect } from "next/navigation";

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  // detect browser language and redirect to the right locale
  const lang = navigator.language.split("-")[0];
  console.log(lang);
  if (lang !== "en") {
    redirect(`/en/${lang}`);
  }
  redirect("/en");
}
