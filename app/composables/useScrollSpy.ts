import { onMounted, onBeforeUnmount } from "vue";

export function useScrollSpy(
  options = { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
) {
  let observer: IntersectionObserver | null = null;

  const initObserver = () => {
    // Ждем следующий тик, чтобы DOM точно отрендерился
    requestAnimationFrame(() => {
      // Ищем все элементы-секции, у которых есть id
      const sections = document.querySelectorAll("main > [id], section[id]");

      if (!sections.length) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Проверяем, что URL действительно меняется, чтобы не спамить replaceState
            if (window.location.hash !== `#${id}`) {
              window.history.replaceState(window.history.state, "", `#${id}`);
            }
          }
        });
      }, options);

      sections.forEach((section) => {
        observer!.observe(section);
      });
    });
  };

  onMounted(() => {
    // Убеждаемся, что код выполняется только на клиенте
    if (import.meta.client) {
      initObserver();
    }
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
}
