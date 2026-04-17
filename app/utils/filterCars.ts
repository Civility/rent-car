export interface CarFilters {
  sortBy?: string;
  transmission?: string; // 'A', 'M', или 'both'
  vehicleType?: string; // 'car', 'vans', 'premium' (согласно вашему дизайну)
  minSeats?: number; // 2, 4, 5, 7
  minPrice?: number | null;
  maxPrice?: number | null;
}

export function applyFilters(cars: any[], filters: CarFilters = {}) {
  let result = [...cars];

  // --- ФИЛЬТРАЦИЯ ---

  // 1. Трансмиссия
  if (filters.transmission && filters.transmission !== "both") {
    result = result.filter(
      (car) => car.features.transmission === filters.transmission,
    );
  }

  // 2. Тип автомобиля (Vehicle type)
  if (filters.vehicleType) {
    result = result.filter((car) => car.type === filters.vehicleType);
  }

  // 3. Количество мест (Seats)
  const minSeats = filters.minSeats;
  if (minSeats !== undefined) {
    result = result.filter((car) => car.features.passengers >= minSeats);
  }

  const minPrice = filters.minPrice;
  if (typeof minPrice === "number") {
    result = result.filter((car) => car.totalPrice >= minPrice);
  }

  // 5. Максимальная цена (Ищем по TOTAL)
  const maxPrice = filters.maxPrice;
  if (typeof maxPrice === "number") {
    result = result.filter((car) => car.totalPrice <= maxPrice);
  }

  // --- СОРТИРОВКА ---
  const sortBy = filters.sortBy || "recommended";

  switch (sortBy) {
    case "price_asc":
      result.sort((a, b) => a.priceDay - b.priceDay);
      break;
    case "price_desc":
      result.sort((a, b) => b.priceDay - a.priceDay);
      break;
    case "recommended":
    default:
      // В моках сортируем по ID. На реальном проекте - по popularity или полям от бэка
      result.sort((a, b) => a.id - b.id);
      break;
  }

  return result;
}
