<script setup>
  const route = useRoute();
  const config = useRuntimeConfig();
  const { locale } = useI18n();
  const canonicalUrl = computed(() =>
    new URL(route.path, config.public.siteURL).toString(),
  );

  useHead({
    titleTemplate: (titleChunk) =>
      titleChunk
        ? `${titleChunk} | ${config.public.siteName}`
        : config.public.siteName,
    link: [
      {
        rel: "canonical",
        href: canonicalUrl,
      },
    ],
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
    <PartAppHeader />
    <NuxtPage class="overflow-x-hidden" />
    <PartAppFooter />
  </div>
</template>
