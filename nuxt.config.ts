// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV !== "production";
const siteURL = isDev ? "http://localhost:3000" : "https://rent-me.na4u.ru";
const apiBase = isDev ? "https://winter.local" : "https://rentme.na4u.ru";
// const siteURL = process.env.NUXT_PUBLIC_SITE_URL;

const siteName = "Rent-Me";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: isDev },
  future: { compatibilityVersion: 4 },
  experimental: { payloadExtraction: false },
  ssr: true,
  nitro: {
    externals: {
      inline: ["@vue/devtools-api"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@unhead/schema-org/vue", "animejs"],
    },
  },
  devServer: {
    port: 3000,
  },
  site: {
    url: siteURL,
    name: siteName,
  },
  css: ["./app/assets/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-svgo",
    "@pinia/nuxt",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "@nuxtjs/i18n",
    "nuxt-security",
  ],
  svgo: {
    autoImportPath: "./app/assets/icons/",
    defaultImport: "component",
  },
  i18n: {
    baseUrl: siteURL,
    strategy: "prefix_except_default",
    defaultLocale: "en",
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    locales: [
      {
        code: "en",
        language: "en-US",
        name: "EN",
        flag: "gb",
        file: "en.json",
      },
      {
        code: "ru",
        language: "ru-RU",
        name: "RU",
        flag: "ru",
        file: "ru.json",
      },
      {
        code: "de",
        language: "de-DE",
        name: "DE",
        flag: "de",
        file: "de.json",
      },
      {
        code: "el",
        language: "el-GR",
        name: "GR",
        flag: "gr",
        file: "el.json",
      },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      redirectOn: "root",
    },
  },

  routeRules: {
    "/": {
      prerender: true,
      security: {
        // prerender не умеет подменять {{nonce}} — используем хэш-политику
        headers: {
          contentSecurityPolicy: {
            "script-src": ["'self'", "'unsafe-inline'"],
          },
        },
        rateLimiter: false,
        xssValidator: false,
      },
    },
    "/booking": { ssr: true },
    "/booking/order": { ssr: true },
    "/api/**": {
      proxy: `${apiBase}/api/**`,
      security: {
        rateLimiter: {
          tokensPerInterval: 30,
          interval: 60_000, // отдельный лимит для API
        },
        xssValidator: { throwError: true },
        corsHandler: {
          origin: [siteURL],
          methods: ["GET", "POST"],
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      siteURL,
      siteName: siteName,
      apiBase: apiBase,
      imageBase: `${apiBase}/storage/app/media/`,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/android-chrome-192x192.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/android-chrome-512x512.png",
        },
      ],
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  robots: {
    sitemap: `${siteURL}/sitemap.xml`,
  },

  sitemap: {
    exclude: ["/booking", "/booking/order"],
  },
  security: {
    strict: false, // true — fail-fast в проде на нарушения CSP; включите после обкатки
    headers: {
      // ----- CSP -----
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'nonce-{{nonce}}'", // для SSR-страниц (booking, booking/order)
          "'strict-dynamic'",
        ],
        // inline-стили нужны Tailwind v4 / Vue SFC / Datepicker
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "connect-src": [
          "'self'",
          apiBase,
          siteURL, // бэкенд-прокси
          // "https://*.google-analytics.com", // при наличии GA — иначе удалите
        ],
        "frame-src": ["'self'"],
        "frame-ancestors": ["'none'"],
        "form-action": ["'self'"],
        "object-src": ["'none'"],
        "worker-src": ["'self'", "blob:"],
        "manifest-src": ["'self'"],
        "media-src": ["'self'", "data:", "blob:"],
        "upgrade-insecure-requests": true,
      },

      // ----- прочие заголовки -----
      strictTransportSecurity: {
        maxAge: 63072000, // 2 года
        includeSubdomains: true,
        preload: true,
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      xFrameOptions: "DENY",
      xContentTypeOptions: "nosniff",
      xXSSProtection: "0", // современные браузеры — лучше отключить
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: [],
        fullscreen: ["self"],
      },
      crossOriginEmbedderPolicy: "unsafe-none", // 'require-corp' ломает сторонние картинки
      crossOriginOpenerPolicy: "same-origin",
      crossOriginResourcePolicy: "same-origin",
      originAgentCluster: "?1",
    },

    // ----- nonce для inline <script> (schema.org JSON-LD, Nuxt payload) -----
    nonce: true,

    // ----- rate limit только для API и бэкенд-эндпоинтов -----
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 60_000, // 1 минута
      headers: true,
      driver: { name: "lruCache" },
      throwError: true,
    },

    // ----- анти-XSS для входящих payload (форма обратной связи, /booking/order) -----
    xssValidator: {
      methods: ["POST", "PUT", "DELETE"],
      throwError: true,
    },

    // ----- ограничение размера body (загрузок файлов у вас нет) -----
    requestSizeLimiter: {
      maxRequestSizeInBytes: 200_000, // 200 KB
      maxUploadFileRequestInBytes: 0,
      throwError: true,
    },

    // ----- CORS: отдавайте только своему домену -----
    corsHandler: {
      origin: [siteURL],
      methods: ["GET", "POST"],
      preflight: { statusCode: 204 },
    },

    // ----- ограничение HTTP-методов для всего сайта -----
    allowedMethodsRestricter: {
      methods: ["GET", "POST", "HEAD", "OPTIONS"],
      throwError: true,
    },

    // ----- прочее -----
    hidePoweredBy: true,
    removeLoggers: {
      external: [],
      consoleType: ["log", "debug"],
      include: [/\.[jt]sx?$/, /\.vue\??/],
      exclude: [/node_modules/],
    },
    basicAuth: false, // true объектом { message, name, pass } для staging
  },
});
