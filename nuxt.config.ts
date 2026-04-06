// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  experimental: { payloadExtraction: false },
  ssr: true,
  nitro: {
    static: true,
    // storage: {
    //   cache: {
    //     driver: "memory", // Используем оперативную память вместо диска V для кэша
    //   },
    // },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 3000,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-svgo",
    "@pinia/nuxt",
  ],
  svgo: {
    autoImportPath: "./app/assets/icons/",
    defaultImport: "component",
  },
  // // image: {
  // // format: ["webp", "avif", "png", "jpg"],
  // // provider: "ipx",
  // // },

  css: ["./app/assets/main.css"],
  routeRules: {
    // // Статические страницы (SSG)
    "/": { prerender: true },
    "/about": { prerender: true },

    // // Страница бронирования (SSR) — будет рендериться на сервере при каждом запросе
    "/booking": { ssr: true },

    // Для API проксируем запросы к нашему Winter CMS
    "/api/**": { proxy: "https://wintercms.local/api/**" },
  },
  runtimeConfig: {
    public: {
      API: "https://wintercms.local",
      IMG: "https://wintercms.local/storage/app/uploads/public/",
    },
  },
});
