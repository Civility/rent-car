<script setup>
const props = defineProps({
  car: { type: Object, required: true },
  days: { type: Number, default: 1 },
});
const { t } = useI18n();
const { formatPrice, getCarPricing } = useCarPricing();
const pricing = computed(() => getCarPricing(props.car, props.days));
</script>

<template>
  <div class="mb-4">
    <p
      class="text-xs font-bold tracking-wider uppercase mb-0.5 bg-linear-to-t from-dark to-dark bg-clip-text text-transparent w-fit"
    >
      {{ t(`order.from`) }}
    </p>

    <p
      v-if="pricing.hasDiscount"
      class="text-sm font-bold text-zinc-500 decoration-dark line-through mb-1 leading-none"
    >
      €{{ formatPrice(pricing.basePriceDay) }}
      <span class="text-sm font-normal">/ {{ t(`order.day`) }}</span>
    </p>

    <p
      class="text-2xl font-black mb-1 leading-none"
      :class="{ 'text-sec': pricing.hasDiscount }"
    >
      €{{ formatPrice(pricing.finalPriceDay) }}
      <span class="text-lg font-normal">/ {{ t(`order.day`) }}</span>
    </p>

    <p
      class="text-md font-bold tracking-wider uppercase mb-0.5 bg-linear-to-t from-dark to-dark bg-clip-text text-transparent w-fit"
    >
      {{ t(`order.total`) }}
      <strong>€{{ formatPrice(pricing.totalPrice) }}</strong>
    </p>
  </div>
</template>
