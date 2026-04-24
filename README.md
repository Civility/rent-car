# Nuxt Minimal Starter

- APP_IP=127.0.4.127 APP_PORT=57855 node start.mjs

## start.mjs

process.env.HOST = process.env.APP_IP || "0.0.0.0";
process.env.PORT = process.env.APP_PORT || "3000";
await import("./server/index.mjs");

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vue/devtools-api' imported from /home/c67185/rent-me.na4u.ru/app/server/node_modules/vue-router/dist/devtools-BPov6AZY.js

- /app/server$ npm i @vue/devtools-api -no-save --omit=dev
