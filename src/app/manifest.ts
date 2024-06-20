import { type MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = "en";
  const t = await getTranslations({ locale });

  return {
    name: t("title"),
    description: t("description"),
    start_url: "/",
    theme_color: "#fff",
  };
}
