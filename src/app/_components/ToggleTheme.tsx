"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-app-theme/use-theme";
import { useTranslations } from "next-intl";
import Button from "./Button";

export function ThemeToggle({
  isMenuButton = false,
}: {
  isMenuButton?: boolean;
}) {
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();
  const icon =
    theme === "dark" ? (
      <SunIcon className="h-4 w-4" />
    ) : (
      <MoonIcon className="h-4 w-4" />
    );

  return (
    <Button
      variant={isMenuButton ? "menuElement" : "chip"}
      onClick={toggleTheme}
    >
      {isMenuButton && (
        <span>{theme === "dark" ? t("theme.light") : t("theme.dark")}</span>
      )}
      {icon}
    </Button>
  );
}
