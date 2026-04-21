import { defineStore } from "pinia";
import { getApiUrl } from "@/composables/useUrls";

export const useMainStore = defineStore("main", {
  state: () => ({
    isLoading: false,
    callbackError: null,
    lang: "ru", // el, de, en
  }),

  actions: {
    setLoading(status) {
      this.isLoading = status;
    },

    setLang(newLang) {
      this.lang = newLang;
    },

    async sendCallMeBack(payload) {
      this.setLoading(true);
      this.callbackError = null;

      const FRIENDLY_ERROR =
        "Something went wrong. Please try again later or call us at +30 697 779 5840.";

      try {
        const response = await $fetch(getApiUrl("/api/callbacks"), {
          method: "POST",
          body: payload,
        });

        if (!response?.success) {
          this.callbackError = FRIENDLY_ERROR;
          return { success: false, error: this.callbackError };
        }

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Callback submission failed:", error);

        this.callbackError = FRIENDLY_ERROR;
        return { success: false, error: this.callbackError };
      } finally {
        this.setLoading(false);
      }
    },
  },
});
