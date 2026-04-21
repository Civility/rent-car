// front/app/composables/useBookingDates.ts
import type { ComputedRef, Ref } from "vue";

export interface BookingTimeValue {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface BookingDatesSource {
  dateFrom?: string | Date | null;
  dateTo?: string | Date | null;
  timeFrom?: BookingTimeValue | null;
  timeTo?: BookingTimeValue | null;
}

const MS_IN_DAY = 1000 * 60 * 60 * 24;

const toValidDate = (value: unknown): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function useBookingDates() {
  const formatDateValue = (value: unknown): string => {
    if (!value) return "Not selected";

    const date = toValidDate(value);
    if (!date) return String(value);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTimeValue = (
    time: BookingTimeValue | null | undefined,
  ): string => {
    if (
      !time ||
      typeof time.hours !== "number" ||
      typeof time.minutes !== "number"
    ) {
      return "00:00";
    }

    const hh = String(time.hours).padStart(2, "0");
    const mm = String(time.minutes).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  /** Чистое вычисление количества дней между двумя значениями. */
  const calcRentalDays = (from: unknown, to: unknown, fallback = 1): number => {
    const start = toValidDate(from);
    const end = toValidDate(to);
    if (!start || !end) return fallback;

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / MS_IN_DAY);
    return diffDays > 0 ? diffDays : fallback;
  };

  /** Реактивный computed по ref на searchForm-подобный объект. */
  const useRentalDays = (
    source: Ref<BookingDatesSource | null | undefined>,
    fallback = 1,
  ): ComputedRef<number> =>
    computed(() =>
      calcRentalDays(source.value?.dateFrom, source.value?.dateTo, fallback),
    );

  return {
    formatDateValue,
    formatTimeValue,
    calcRentalDays,
    useRentalDays,
  };
}
