// app/composables/useUrls.ts

export const getApiUrl = (path: string) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${cleanPath}`;
};

export const getImageUrl = (path: string | null) => {
  const config = useRuntimeConfig();
  const imageBase = config.public.imageBase;
  return `${imageBase}${path}`;
};
export const IMG = (name: string) =>
  new URL(`../assets/webp/${name}.webp`, import.meta.url).href;
