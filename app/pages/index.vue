<script setup>
const config = useRuntimeConfig();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const ogLocaleMap = {
  en: "en_US",
  ru: "ru_RU",
  de: "de_DE",
  el: "el_GR",
};
useSeoMeta({
  title: t("seo.title"),
  description: t("seo.description"),
  ogTitle: t("seo.title"),
  ogDescription: t("seo.description"),
  ogType: "website",
  ogUrl: config.public.siteURL,
  ogLocale: ogLocaleMap[locale.value] || "en_US",
  ogImage: `${config.public.siteURL}/android-chrome-512x512.png`,
  twitterCard: "summary_large_image",
  twitterTitle: t("seo.title"),
  twitterDescription: t("seo.description"),
  twitterImage: `${config.public.siteURL}/android-chrome-512x512.png`,
});

useSchemaOrg([
  {
    "@type": "AutoRental",
    "@id": `${config.public.siteURL}/#business`,
    name: config.public.siteName,
    url: config.public.siteURL,
    image: `${config.public.siteURL}/android-chrome-512x512.png`,
    telephone: "+30 697 779 5840",
    email: "info@rent-me.gr",
    priceRange: "€",
    paymentAccepted: "Cash, VISA, MasterCard, Maestro, PayPal",
    areaServed: ["Thessaloniki", "Lagadas"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lagina-Lagadas-Thessaloniki",
      addressLocality: "Thessaloniki",
      postalCode: "57200",
      addressCountry: "GR",
    },
    sameAs: ["https://www.facebook.com/profile.php?id=100093357895988"],
  },
]);
</script>
<template>
  <main class="relative">
    <SectionsOne id="home" />
    <SectionsTwo id="about" />
    <SectionsThree />
    <SectionsFour id="terms" />
    <SectionsFive id="faq" />
    <SectionsSix id="contacts" />
    <div class="fixed right-10 bottom-5 z-30 group">
      <img
        src="@/assets/webp/floating-image.webp"
        alt="floating"
        aria-hidden="true"
        class="absolute bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 scale-350"
      />
      <div class="relative w-14 h-14">
        <span
          class="absolute inset-0 rounded-full bg-main/50 animate-ping pointer-events-none [animation-delay:0s]"
        />
        <span
          class="group-hover:animate-ping absolute inset-0 rounded-full bg-main/35 pointer-events-none [animation-delay:0.4s]"
        />
        <span
          class="absolute inset-0 rounded-full bg-main/20 group-hover:animate-ping pointer-events-none [animation-delay:0.8s]"
        />

        <NuxtLink
          :to="localePath('/') + '#findCar'"
          class="absolute inset-0 flex items-center justify-center rounded-full bg-main text-white uppercase font-bold text-xs leading-tight overflow-hidden shadow-lg"
        >
          <span class="relative z-10 flex flex-col items-center text-center">
            <span>{{ $t("common.find") }}</span>
            <span>{{ $t("common.car") }}</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
