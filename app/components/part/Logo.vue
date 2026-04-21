<script setup>
import lOGO_CARS from "@/assets/icons/logo_cars.svg";
import lOGO_NAME from "@/assets/icons/logo_name.svg";
import lOGO_BAG from "@/assets/icons/logo_bag.svg";
defineProps({
  class1: {
    type: String,
    default: null,
  },
  class2: {
    type: String,
    default: null,
  },
  class3: {
    type: String,
    default: null,
  },
});
</script>
<template>
  <div class="relative transition-all flex justify-center items-center">
    <UISvg
      :svg="lOGO_BAG"
      class="h-32 w-32 text-main-dark absolute"
      :class="class1"
    />
    <UISvg
      :svg="lOGO_NAME"
      class="h-22 w-22 text-smoke absolute z-10 origin-center animate-rotate-pause transition-transform duration-100"
      :class="class2"
    />
    <UISvg
      :svg="lOGO_CARS"
      class="h-22 w-22 text-smoke absolute z-20"
      :class="class3"
    />
  </div>
</template>
