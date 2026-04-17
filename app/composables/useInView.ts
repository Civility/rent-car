import { watch, onBeforeUnmount } from "vue";
import type { Ref } from "vue";

export function useInView(
  targetRef: Ref<HTMLElement | null>,
  callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { threshold: 0 },
) {
  // Выполняем только в браузере (исключаем SSR ошибки)
  if (!import.meta.client) return;

  let observer: IntersectionObserver | null = null;

  // watch сам дождется, когда элемент появится в DOM (замена onMounted)
  watch(
    targetRef,
    (el) => {
      // Если обсервер уже был запущен для старого элемента, отключаем
      if (observer) observer.disconnect();

      if (!el) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting, entry);
        });
      }, options);

      observer.observe(el);
    },
    { immediate: true },
  );

  // Автоматически очищаем память при уничтожении компонента
  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });
}
