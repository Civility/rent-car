// app/store/booking.js
import { defineStore } from "pinia";

// import { useMainStore } from "./main.js";
export const useBookingStore = defineStore("booking", {
  state: () => ({
    searchForm: {
      location: "SKG",
      differentLocation: true,
      returnLocation: "SKG",
      dateFrom: "Mon Apr 27 2026 14:45:00 GMT+0300",
      timeFrom: { hours: 0, minutes: 0, seconds: 0 },
      dateTo: "Thu Apr 30 2026 14:45:00 GMT+0300",
      timeTo: { hours: 0, minutes: 0, seconds: 0 },
      auto: null,
    },
    isLoading: false,
    orderError: null,
    orderSuccess: false,
  }),
  actions: {
    setSearchForm(payload) {
      Object.assign(this.searchForm, payload, { lastActive: Date.now() });
    },
    $reset() {
      Object.assign(this.searchForm, {
        location: "SKG",
        differentLocation: true,
        returnLocation: "SKG",
        dateFrom: null,
        timeFrom: { hours: 0, minutes: 0, seconds: 0 },
        dateTo: null,
        timeTo: { hours: 0, minutes: 0, seconds: 0 },
        auto: null,
        formattedDateFrom: undefined,
        formattedDateTo: undefined,
      });
      this.orderError = null;
      this.orderSuccess = false;
    },
    async submitOrder(driverDetails) {
      this.isLoading = true;
      this.orderError = null;
      this.orderSuccess = false;

      try {
        // Формируем итоговый объект (Search Data + Car Data + Driver Data)
        const orderPayload = {
          searchData: {
            pickUp: this.searchForm.location,
            dropOff: this.searchForm.differentLocation
              ? this.searchForm.location
              : this.searchForm.returnLocation,
            dateFrom: this.searchForm.formattedDateFrom,
            dateTo: this.searchForm.formattedDateTo,
          },
          carId: this.searchForm.auto?.id,
          driver: {
            firstName: driverDetails.firstName,
            lastName: driverDetails.lastName,
            email: driverDetails.email,
            phone: driverDetails.phone,
            dateOfBirth: driverDetails.dateOfBirth,
          },
        };

        // Запрос к вашему Nuxt API (прокси на Laravel/WinterCMS)
        // Замените '/api/orders' на реальный путь вашего бэкенда
        const response = await $fetch("/api/orders", {
          method: "POST",
          body: orderPayload,
        });

        this.orderSuccess = true;
        return { success: true, data: response };
      } catch (error) {
        console.error("Order submission failed:", error);
        this.orderError =
          error.data?.message || "Something went wrong. Please try again.";
        return { success: false, error: this.orderError };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
