// app/store/booking.js
import { defineStore } from "pinia";
import { buildOrderPayload } from "@/composables/buildOrderPayload";
import { useBookingDates } from "@/composables/useBookingDates";
import { useMainStore } from "./main.js";
const STORAGE_KEY = "booking-search";
const createDefaultSearchForm = () => ({
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
const loadFromSession = () => {
  if (import.meta.server) return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveToSession = (searchForm) => {
  if (import.meta.server) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchForm));
    // eslint-disable-next-line no-empty
  } catch {}
};
export const useBookingStore = defineStore("booking", {
  state: () => ({
    searchForm: {
      ...createDefaultSearchForm(),
      ...(loadFromSession() || {}),
    },
    locations: [],
    cars: [],
    orderError: null,
    orderSuccess: false,
  }),

  getters: {
    rentalDays(state) {
      const { calcRentalDays } = useBookingDates();
      return calcRentalDays(state.searchForm.dateFrom, state.searchForm.dateTo);
    },
    dropoffCode(state) {
      return state.searchForm.differentLocation
        ? state.searchForm.location
        : state.searchForm.returnLocation;
    },
  },

  actions: {
    async fetchLocations() {
      if (this.locations.length) return { success: true, data: this.locations };
      const main = useMainStore();
      main.setLoading(true);

      try {
        const response = await $fetch(getApiUrl("/api/locations"));
        this.locations = response.map((location) => ({
          id: location.id,
          value: location.code,
          label: location.name,
        }));

        return { success: true, data: this.locations };
      } catch (error) {
        console.error("Error locations:", error);
        return { success: false, error };
      } finally {
        main.setLoading(false);
      }
    },

    async fetchCars() {
      const main = useMainStore();
      main.setLoading(true);

      try {
        const response = await $fetch(getApiUrl("/api/cars"), {
          query: {
            date_from: this.searchForm.formattedDateFrom,
            date_to: this.searchForm.formattedDateTo,
          },
        });
        this.cars = response;
        return { success: true, data: response };
      } catch (error) {
        console.error("Error cars:", error);
        this.cars = [];
        return { success: false, error };
      } finally {
        main.setLoading(false);
      }
    },

    async submitOrder(driverDetails) {
      this.orderError = null;
      this.orderSuccess = false;
      const main = useMainStore();
      main.setLoading(true);
      try {
        if (!this.locations.length) {
          await this.fetchLocations();
        }

        const payload = buildOrderPayload(
          this.searchForm,
          driverDetails,
          this.locations,
        );

        const response = await $fetch(getApiUrl("/api/orders"), {
          method: "POST",
          body: payload,
        });

        this.orderSuccess = true;
        return { success: true, data: response };
      } catch (error) {
        console.error("Order submission failed:", error);
        this.orderError =
          error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.";
        return { success: false, error: this.orderError };
      } finally {
        main.setLoading(false);
      }
    },

    setLocation(location) {
      this.searchForm.location = location;

      if (this.searchForm.differentLocation) {
        this.searchForm.returnLocation = location;
      }
    },

    setReturnLocation(returnLocation) {
      this.searchForm.returnLocation = returnLocation;
    },

    setDifferentLocation(differentLocation) {
      this.searchForm.differentLocation = differentLocation;

      if (differentLocation) {
        this.searchForm.returnLocation = this.searchForm.location;
      }
    },
    setSearchForm(payload) {
      Object.assign(this.searchForm, payload, { lastActive: Date.now() });
      saveToSession(this.searchForm);
    },
    $reset() {
      Object.assign(this.searchForm, createDefaultSearchForm());
      this.orderError = null;
      this.orderSuccess = false;
      saveToSession(this.searchForm);
    },
  },
});
