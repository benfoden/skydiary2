export type Lang = "en" | "ja";

export type Dict = {
  [key: string]: string | Dict;
};

export const i18nConfig = {
  locales: ["en", "ja"],
  defaultLocale: "en",
};

export const LANGS: Array<Lang> = ["en", "ja"];

export const otherLang = (lang: Lang) => (lang === "en" ? "ja" : "en");

const langs: Array<Lang> = i18nConfig.locales as unknown as Array<Lang>;

export const getOtherLanguages = (lang: Lang) =>
  langs.filter((l) => l !== lang);

function getFromDictionary(
  keys: Array<string>,
  dict: Dict | string,
): Dict | string {
  if (typeof dict === "string") return dict;
  if (keys.length === 0) return "";
  if (!dict) return "";

  const key = keys.shift() ?? "";

  if (typeof dict[key] === "undefined") return "";

  return getFromDictionary(keys, dict[key]!);
}

export const translateKey = (key: string, dict: Dict): string => {
  if (!key) return "";
  const keys = key.split(".");
  const result = getFromDictionary(keys, dict);
  if (!result) return key;
  if (typeof result !== "string") {
    console.error("getFromDictionary returned a non-string: " + typeof result);
    return key;
  }
  return result;
};
