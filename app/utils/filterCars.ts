export interface CarFilters {
  sortBy?: string;
  transmission?: string;
  vehicleType?: string;
  minSeats?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface CarCategory {
  id: number;
  name: string;
}

export interface CarType {
  id: number;
  name: string;
}

export interface CarPrice {
  priceDay: number;
  excess: number;
  deposit: number;
  discount: number;
}

export interface CarFeatures {
  year: number | null;
  seats: number;
  doors: number;
  bags: number;
  ac: boolean;
  age: number;
  transmission: string;
  fuel: string | null;
  horsepower: number | null;
  body: string | null;
  driveType: string | null;
  engineCapacity: string | number | null;
}

export interface FilterableCar {
  id: number;
  name: string;
  category: CarCategory;
  type: CarType;
  img: string | null;
  images: string[];
  price: CarPrice;
  features: CarFeatures;
  totalPrice?: number;
}

// Приводим тип машины к значениям, которые уже ожидает фронт.
const getVehicleTypeValue = (car: FilterableCar): string => {
  const typeName = car.type?.name?.toLowerCase() || "";

  if (typeName.includes("premium")) {
    return "premium";
  }

  if (typeName.includes("van") || typeName.includes("truck")) {
    return "vans";
  }

  return "car";
};

// Берём цену за день из новой вложенной структуры.
const getPricePerDay = (car: FilterableCar): number => {
  return Number(car.price?.priceDay ?? 0);
};

export function applyFilters(
  cars: FilterableCar[],
  filters: CarFilters = {},
): FilterableCar[] {
  let result = [...cars];

  // 1. Фильтр по трансмиссии.
  if (filters.transmission && filters.transmission !== "both") {
    result = result.filter(
      (car) => car.features.transmission === filters.transmission,
    );
  }

  // 2. Фильтр по типу машины.
  if (filters.vehicleType) {
    result = result.filter(
      (car) => getVehicleTypeValue(car) === filters.vehicleType,
    );
  }

  // 3. Фильтр по количеству мест.
  if (filters.minSeats !== undefined) {
    result = result.filter((car) => car.features.seats >= filters.minSeats!);
  }

  // 4. Фильтр по минимальной итоговой цене.
  if (typeof filters.minPrice === "number") {
    result = result.filter(
      (car) => Number(car.totalPrice ?? 0) >= filters.minPrice!,
    );
  }

  // 5. Фильтр по максимальной итоговой цене.
  if (typeof filters.maxPrice === "number") {
    result = result.filter(
      (car) => Number(car.totalPrice ?? 0) <= filters.maxPrice!,
    );
  }

  // 6. Сортировка.

  const getDiscountAmount = (car: FilterableCar): number => {
    return Number(car.price?.discount ?? 0);
  };

  const getFinalPricePerDay = (car: FilterableCar): number => {
    return Math.max(getPricePerDay(car) - getDiscountAmount(car), 0);
  };
  switch (filters.sortBy || "recommended") {
    case "discount":
      result.sort((a, b) => {
        const discountDiff = getDiscountAmount(b) - getDiscountAmount(a);

        if (discountDiff !== 0) {
          return discountDiff;
        }

        return getFinalPricePerDay(a) - getFinalPricePerDay(b);
      });
      break;
    case "price_asc":
      result.sort((a, b) => getFinalPricePerDay(a) - getFinalPricePerDay(b));
      break;

    case "price_desc":
      result.sort((a, b) => getFinalPricePerDay(b) - getFinalPricePerDay(a));
      break;

    case "recommended":
      result.sort((a, b) => {
        const discountDiff = getDiscountAmount(b) - getDiscountAmount(a);

        if (discountDiff !== 0) {
          return discountDiff;
        }

        return getFinalPricePerDay(a) - getFinalPricePerDay(b);
      });
      break;

    default:
      result.sort((a, b) => getFinalPricePerDay(a) - getFinalPricePerDay(b));
      break;
  }

  return result;
}
