<script setup>
import lOGO_CARS from "@/assets/icons/logo_cars.svg?component";
import lOGO_NAME from "@/assets/icons/logo_name.svg?component";
import lOGO_BAG from "@/assets/icons/logo_bag.svg?component";
</script>
<template>
  <div class="relative flex justify-center items-center h-32 w-32">
    <!-- <img
      src="~/assets/webp/leaf-5.webp"
      alt="leaf-5"
      class="w-auto h-22 z-30 absolute -right-1/4 top-1/3 pointer-none"
    /> -->
    <UISvg :svg="lOGO_BAG" class="h-32 w-32 text-[#005BB4] absolute" />
    <UISvg
      :svg="lOGO_NAME"
      class="h-22 w-22 text-smoke absolute z-10 origin-center animate-rotate-pause transition-transform duration-100"
    />
    <UISvg :svg="lOGO_CARS" class="h-22 w-22 text-smoke absolute z-20" />
    <!-- <img
      src="~/assets/webp/shape.webp"
      alt="logo"
      class="-z-10 h-62 w-70 absolute right-5 rotate-59 -scale-x-150 pointer-none:"
    /> -->
  </div>
</template>
