// app/composables/usePriceCalculator.ts
export const usePriceCalculator = () => {
  /**
   * Рассчитывает итоговую стоимость аренды с учетом скидки за длительность.
   * @param pricePerDay - Базовая цена машины за 1 день.
   * @param days - Количество дней аренды.
   * @returns Итоговая сумма (с двумя знаками после запятой).
   */
  const calculateTotal = (pricePerDay: number, days: number): string => {
    let discount = 0;

    if (days >= 4 && days <= 7) discount = 0.1;
    else if (days >= 8 && days <= 14) discount = 0.15;
    else if (days > 14) discount = 0.2;

    const totalWithoutDiscount = pricePerDay * days;
    const finalTotal = totalWithoutDiscount - totalWithoutDiscount * discount;

    return finalTotal.toFixed(2);
  };

  return {
    calculateTotal,
  };
};
