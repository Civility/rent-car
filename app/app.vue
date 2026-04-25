<script setup>
import { useMainStore } from "@/store/main";
const main = useMainStore();
const route = useRoute();
const config = useRuntimeConfig();
const { locale } = useI18n();

const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
});
const canonicalUrl = computed(() =>
  new URL(route.path, config.public.siteURL).toString(),
);
onMounted(() => {
  if (document.readyState !== "complete") {
    main.setLoading(true);
    window.addEventListener("load", () => main.setLoading(false), {
      once: true,
    });
  }
});
useHead({
  htmlAttrs: computed(() => head.value.htmlAttrs),
  link: computed(() => [
    ...(head.value.link || []),
    { rel: "canonical", href: canonicalUrl.value },
  ]),
  meta: computed(() => head.value.meta || []),
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} | ${config.public.siteName}`
      : config.public.siteName,
});

useSeoMeta({
  ogSiteName: config.public.siteName,
  twitterCard: "summary_large_image",
});
useSchemaOrg([
  defineWebSite({
    name: config.public.siteName,
    url: config.public.siteURL,
    inLanguage: locale.value,
  }),
  defineOrganization({
    name: config.public.siteName,
    url: config.public.siteURL,
    sameAs: ["https://www.facebook.com/profile.php?id=100093357895988"],
  }),
]);
</script>
<template>
  <div>
    <ClientOnly><PartPreloader /></ClientOnly>
    <PartAppHeader />
    <NuxtPage class="overflow-x-clip" />
    <PartAppFooter />
  </div>
</template>
