import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Button from "./Button";
import DropDownMenu from "./DropDown";

export default async function DropDownUser() {
  const t = await getTranslations();
  return (
    <DropDownMenu isUserMenu>
      <Link href={"/settings"}>
        <Button variant="menuElement">
          {t("nav.settings")} <GearIcon className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={"/auth/signout"}>
        <Button variant="menuElement">
          {t("nav.signout")}
          <ExitIcon className="h-4 w-4" />
        </Button>
      </Link>
    </DropDownMenu>
  );
}
