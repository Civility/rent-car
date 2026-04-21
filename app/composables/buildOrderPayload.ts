// front/app/store/helpers/buildOrderPayload.ts

export interface OrderDriverDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | Date | null;
}

export interface OrderSearchFormSource {
  auto?: { id?: number | null } | null;
  location?: string | null;
  returnLocation?: string | null;
  differentLocation?: boolean | null;
  dateFrom?: string | Date | null;
  dateTo?: string | Date | null;
  formattedDateFrom?: string | null;
  formattedDateTo?: string | null;
}

export interface OrderLocationOption {
  id?: number | null;
  value: string;
  label?: string;
}

export interface OrderPayload {
  car_id: number;
  location_id: number;
  return_location_id: number;
  date_from: string;
  date_to: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string | null;
}

/** YYYY-MM-DD без таймзонных сдвигов. */
const formatDobDate = (value: unknown): string | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toApiDate = (
  formatted: string | null | undefined,
  raw: string | Date | null | undefined,
): string | null => {
  if (formatted) return formatted;
  if (!raw) return null;
  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

/**
 * Собирает payload для POST /api/orders.
 * Кидает ошибку с человекочитаемым сообщением, если данных недостаточно.
 */
export function buildOrderPayload(
  searchForm: OrderSearchFormSource,
  driver: OrderDriverDetails,
  locations: OrderLocationOption[],
): OrderPayload {
  const carId = searchForm.auto?.id;
  if (!carId) {
    throw new Error("Car is not selected.");
  }

  const pickupCode = searchForm.location ?? null;
  const dropoffCode = searchForm.differentLocation
    ? searchForm.location
    : searchForm.returnLocation;

  const pickup = locations.find((l) => l.value === pickupCode);
  const dropoff = locations.find((l) => l.value === dropoffCode);

  if (!pickup?.id || !dropoff?.id) {
    throw new Error("Pickup or drop-off location is invalid.");
  }

  const dateFrom = toApiDate(searchForm.formattedDateFrom, searchForm.dateFrom);
  const dateTo = toApiDate(searchForm.formattedDateTo, searchForm.dateTo);

  if (!dateFrom || !dateTo) {
    throw new Error("Rental dates are invalid.");
  }

  return {
    car_id: carId,
    location_id: pickup.id,
    return_location_id: dropoff.id,
    date_from: dateFrom,
    date_to: dateTo,
    first_name: driver.firstName,
    last_name: driver.lastName,
    email: driver.email,
    phone: driver.phone,
    dob: formatDobDate(driver.dateOfBirth),
  };
}
