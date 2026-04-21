// front/app/composables/useCarPricing.ts

export interface CarPriceSource {
  price?: {
    priceDay?: number | string | null;
    discount?: number | string | null;
    excess?: number | string | null;
    deposit?: number | string | null;
  } | null;
}

export interface CarPricing {
  basePriceDay: number;
  discountPerDay: number;
  finalPriceDay: number;
  hasDiscount: boolean;
  totalPrice: number;
  oldTotalPrice: number;
}

/**
 * Единая точка правды по ценам автомобиля.
 * `discount` из API — это сумма в EUR/день, не процент.
 */
export function useCarPricing() {
  const toNumber = (value: unknown): number => {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  const formatPrice = (value: unknown): string => toNumber(value).toFixed(2);

  const getBasePricePerDay = (car: CarPriceSource | null | undefined): number =>
    toNumber(car?.price?.priceDay);

  const getDiscountAmount = (car: CarPriceSource | null | undefined): number =>
    toNumber(car?.price?.discount);

  const getFinalPricePerDay = (
    car: CarPriceSource | null | undefined,
  ): number => Math.max(getBasePricePerDay(car) - getDiscountAmount(car), 0);

  const hasDiscount = (car: CarPriceSource | null | undefined): boolean => {
    const discount = getDiscountAmount(car);
    return discount > 0 && getFinalPricePerDay(car) < getBasePricePerDay(car);
  };

  const getTotalPrice = (
    car: CarPriceSource | null | undefined,
    days: number,
  ): number => {
    const safeDays = Math.max(Math.floor(days) || 0, 0);
    return getFinalPricePerDay(car) * safeDays;
  };

  const getOldTotalPrice = (
    car: CarPriceSource | null | undefined,
    days: number,
  ): number => {
    const safeDays = Math.max(Math.floor(days) || 0, 0);
    return getBasePricePerDay(car) * safeDays;
  };

  /** Полный срез цен для карточки/саммари одним вызовом. */
  const getCarPricing = (
    car: CarPriceSource | null | undefined,
    days: number,
  ): CarPricing => {
    const basePriceDay = getBasePricePerDay(car);
    const discountPerDay = getDiscountAmount(car);
    const finalPriceDay = Math.max(basePriceDay - discountPerDay, 0);
    const safeDays = Math.max(Math.floor(days) || 0, 0);

    return {
      basePriceDay,
      discountPerDay,
      finalPriceDay,
      hasDiscount: discountPerDay > 0 && finalPriceDay < basePriceDay,
      totalPrice: finalPriceDay * safeDays,
      oldTotalPrice: basePriceDay * safeDays,
    };
  };

  return {
    formatPrice,
    getBasePricePerDay,
    getDiscountAmount,
    getFinalPricePerDay,
    hasDiscount,
    getTotalPrice,
    getOldTotalPrice,
    getCarPricing,
  };
}
