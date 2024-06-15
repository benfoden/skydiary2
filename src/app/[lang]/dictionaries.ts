import "server-only";
import { translateKey, type Dict, type Lang } from "~/utils/i18n";

interface Dicts {
  en: () => Promise<Dict>;
  ja: () => Promise<Dict>;
}

const dictionaries: Dicts = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (lang: Lang): Promise<Dict> => {
  const dictionaryFunction = dictionaries[lang];
  if (typeof dictionaryFunction === "function") {
    return dictionaryFunction();
  } else {
    throw new Error(`Dictionary not found for language: ${lang}`);
  }
};

export type Translator = (key: string) => string | undefined;
export const getTranslations = async (lang: Lang): Promise<Translator> => {
  const dict = await getDictionary(lang);

  return (key: string): string | undefined => translateKey(key, dict);
};
