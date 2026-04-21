// front/app/composables/useBookingLocations.ts
import type { ComputedRef, Ref } from "vue";

export interface BookingLocationOption {
  value: string;
  label: string;
}

export interface BookingLocationsSearchForm {
  location?: string | null;
  returnLocation?: string | null;
  /**
   * ВАЖНО: в проекте флаг называется `differentLocation`,
   * но по факту UI использует его как «same return location».
   * Здесь сохраняем текущую семантику из order.vue:
   *   differentLocation === true  → drop-off = location (тот же)
   *   differentLocation === false → drop-off = returnLocation (другой)
   */
  differentLocation?: boolean | null;
}

export function useBookingLocations(
  locations: Ref<BookingLocationOption[]>,
  searchForm?: Ref<BookingLocationsSearchForm | null | undefined>,
) {
  const getLocationLabel = (code?: string | null): string => {
    if (!code) return "Not selected";
    const found = locations.value.find((item) => item.value === code);
    return found?.label || code || "Not selected";
  };

  const getLocationId = (code?: string | null): number | null => {
    if (!code) return null;
    const found = locations.value.find((item) => item.value === code) as
      | (BookingLocationOption & { id?: number })
      | undefined;
    return found?.id ?? null;
  };

  const pickupLocationLabel: ComputedRef<string> = computed(() =>
    getLocationLabel(searchForm?.value?.location),
  );

  const dropoffLocationLabel: ComputedRef<string> = computed(() => {
    const form = searchForm?.value;
    if (!form) return "Not selected";

    const code = form.differentLocation ? form.location : form.returnLocation;
    return getLocationLabel(code);
  });

  return {
    getLocationLabel,
    getLocationId,
    pickupLocationLabel,
    dropoffLocationLabel,
  };
}
