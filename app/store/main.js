import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    isLoading: false,
    lastActive: null,
    lang: "ru", // el, de, en
    currency: null, // Добавлено для правильной реактивности Pinia
  }),
  actions: {
    setLoading(status) {
      this.isLoading = status;
    },
    setCurrency(currency) {
      this.currency = currency;
    },
    setLang(newLang) {
      this.lang = newLang;
    },
    // Экшен для отправки формы обратной связи
    async sendCallMeBack(payload) {
      this.setLoading(true);

      try {
        console.log("Отправка данных формы на сервер...", payload);

        // Имитация задержки сети (убрать при реальном API)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Возвращаем флаг успешности
        return { success: true };
      } catch (error) {
        console.error("Ошибка при отправке формы:", error);
        return { success: false, error };
      } finally {
        this.setLoading(false);
      }
    },
  },
});
