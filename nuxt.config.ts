// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
const siteURL = "https://winter.local";
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
    "/": { prerender: true }, // статика
    "/order": { ssr: true }, // SSR на каждый запрос
    "/booking": { ssr: true }, // SSR на каждый запрос
    "/api/**": { proxy: `${siteURL}/api/**` },
  },
  runtimeConfig: {
    public: {
      apiBase: `${siteURL}`,
      imageBase: `${siteURL}/storage/app/media/`,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
});
