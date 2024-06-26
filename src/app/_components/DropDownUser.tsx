import { ExitIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Button from "./Button";
import DropDownMenu from "./DropDown";
import { ThemeToggle } from "./ToggleTheme";

export default async function DropDownUser() {
  const session = await getServerAuthSession();
  const t = await getTranslations();
  return (
    <DropDownMenu isUserMenu>
      <Link href={"/settings"}>
        <Button variant="menuElement">
          {t("nav.settings")} <GearIcon className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={"/persona/all"}>
        <Button variant="menuElement">
          {t("nav.personas")} <PersonIcon className="h-4 w-4" />
        </Button>
      </Link>
      {session?.user.email === "ben.foden@gmail.com" && (
        <Link href={"/sd-admin"}>
          <Button variant="menuElement">webmaster zone</Button>
        </Link>
      )}
      <ThemeToggle isMenuButton />
      <Link href={"/auth/signout"}>
        <Button variant="menuElement">
          {t("nav.signout")}
          <ExitIcon className="h-4 w-4" />
        </Button>
      </Link>
    </DropDownMenu>
  );
}
