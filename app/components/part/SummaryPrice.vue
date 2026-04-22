<script setup>
const { t } = useI18n();
const props = defineProps({
  car: { type: Object, required: true },
  days: { type: Number, default: 1 },
});

const { formatPrice, getCarPricing } = useCarPricing();
const pricing = computed(() => getCarPricing(props.car, props.days));
</script>

<template>
  <div class="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
    <div class="flex justify-between items-center mb-1">
      <span class="text-sm font-bold text-gray-500 uppercase">
        {{ t("order.pricePerDay") }}
      </span>

      <div class="text-right">
        <div
          v-if="pricing.hasDiscount"
          class="text-sm text-gray-400 line-through decoration-red-500 decoration-2"
        >
          € {{ formatPrice(pricing.basePriceDay) }}
        </div>
        <div class="font-bold text-gray-700">
          € {{ formatPrice(pricing.finalPriceDay) }}
        </div>
      </div>
    </div>

    <div
      class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200"
    >
      <span
        class="text-lg font-black bg-linear-to-t from-dark to-dark bg-clip-text text-transparent uppercase tracking-wide"
      >
        {{ t("order.total") }}
      </span>
      <div class="text-right">
        <div class="text-2xl font-black">
          € {{ formatPrice(pricing.totalPrice) }}
        </div>
      </div>
    </div>
  </div>
</template>
