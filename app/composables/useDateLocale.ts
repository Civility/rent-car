import { computed } from "vue";
import type { Locale } from "date-fns";
import { enUS, ru, de, el } from "date-fns/locale";
import { useI18n } from "#imports";

const localeMap: Record<"en" | "ru" | "de" | "el", Locale> = {
  en: enUS,
  ru,
  de,
  el,
};

type AppLocale = keyof typeof localeMap;

const resolveDateLocale = (code: string): Locale => {
  return localeMap[(code in localeMap ? code : "en") as AppLocale];
};

export const useDateLocale = () => {
  const { locale } = useI18n();

  const dateLocale = computed<Locale>(() => resolveDateLocale(locale.value));

  return { dateLocale };
};
