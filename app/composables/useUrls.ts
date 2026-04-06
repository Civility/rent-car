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

  if (!path) return "/car-placeholder.png";

  return `${imageBase}${path}`;
};
