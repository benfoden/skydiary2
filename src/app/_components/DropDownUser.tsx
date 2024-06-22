import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Button from "./Button";
import DropDownMenu from "./DropDown";

export default async function DropDownUser() {
  const t = await getTranslations();
  return (
    <DropDownMenu isUserMenu>
      <Link href={"/settings"}>
        <Button variant="menuElement">{t("nav.settings")}</Button>
      </Link>
      <Link href={"/auth/signout"}>
        <Button variant="menuElement">{t("nav.signout")}</Button>
      </Link>
    </DropDownMenu>
  );
}
