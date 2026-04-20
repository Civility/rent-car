// app/store/booking.js
import { defineStore } from "pinia";
// const config = useRuntimeConfig;
import { useMainStore } from "./main.js";
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
    locations: [],
    cars: [],
    isLoading: false,
    orderError: null,
    orderSuccess: false,
  }),
  actions: {
    async fetchLocations() {
      // if (!force) {
      //   return { success: true, data: this.locations };
      // }
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
        console.error("error locations", error);
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
            date_from: this.searchForm.dateFrom,
            date_to: this.searchForm.dateTo,
          },
        });
        this.cars = response;
        return { success: true, data: response };
      } catch (error) {
        console.error("Error Cars:", error);
        this.cars = [];
        return { success: false, error };
      } finally {
        main.setLoading(false);
      }
    },
    async submitOrder(driverDetails) {
      this.isLoading = true;
      this.orderError = null;
      this.orderSuccess = false;

      try {
        if (!this.searchForm.auto?.id) {
          throw new Error("Car is not selected.");
        }

        if (!this.locations.length) {
          await this.fetchLocations();
        }

        const pickupCode = this.searchForm.location;
        const dropoffCode = this.searchForm.differentLocation
          ? this.searchForm.location
          : this.searchForm.returnLocation;

        const pickupLocation = this.locations.find(
          (location) => location.value === pickupCode,
        );
        const dropoffLocation = this.locations.find(
          (location) => location.value === dropoffCode,
        );

        if (!pickupLocation?.id || !dropoffLocation?.id) {
          throw new Error("Pickup or drop-off location is invalid.");
        }

        const formatDob = (value) => {
          if (!value) return null;

          const date = new Date(value);

          if (Number.isNaN(date.getTime())) {
            return null;
          }

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        };

        const payload = {
          car_id: this.searchForm.auto.id,
          location_id: pickupLocation.id,
          return_location_id: dropoffLocation.id,
          date_from: this.searchForm.formattedDateFrom,
          date_to: this.searchForm.formattedDateTo,
          first_name: driverDetails.firstName,
          last_name: driverDetails.lastName,
          email: driverDetails.email,
          phone: driverDetails.phone,
          dob: formatDob(driverDetails.dateOfBirth),
        };

        const response = await $fetch(getApiUrl("/api/orders"), {
          method: "POST",
          body: payload,
        });

        this.orderSuccess = true;
        return { success: true, data: response };
      } catch (error) {
        console.error("Order submission failed:", error);
        this.orderError = error?.data?.message;
        error?.message || "Something went wrong. Please try again.";
        return { success: false, error: this.orderError };
      } finally {
        this.isLoading = false;
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
  },
});
