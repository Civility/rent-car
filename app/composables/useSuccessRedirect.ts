// front/app/composables/useSuccessRedirect.ts
import { useRouter } from "vue-router";

export interface SuccessRedirectOptions {
  /** Куда редиректить после закрытия. По умолчанию "/". */
  redirectTo?: string;
  /** Задержка авто-закрытия в мс. По умолчанию 3500. */
  delay?: number;
  /** Необязательный хук до редиректа (например, store.$reset()). */
  onBeforeRedirect?: () => void | Promise<void>;
}

export function useSuccessRedirect(options: SuccessRedirectOptions = {}) {
  const { redirectTo = "/", delay = 3500, onBeforeRedirect } = options;

  const router = useRouter();
  const isOpen = ref(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clearRedirectTimeout = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const close = async () => {
    isOpen.value = false;
    clearRedirectTimeout();

    if (onBeforeRedirect) {
      await onBeforeRedirect();
    }

    await router.push(redirectTo);
  };

  const open = () => {
    isOpen.value = true;
    clearRedirectTimeout();

    timeoutId = setTimeout(() => {
      void close();
    }, delay);
  };

  onBeforeUnmount(() => {
    clearRedirectTimeout();
  });

  return {
    isOpen,
    open,
    close,
    clearRedirectTimeout,
  };
}
