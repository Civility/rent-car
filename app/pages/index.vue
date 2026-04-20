<script setup>
import { useBookingStore } from "@/store/booking";
useScrollSpy();
const { fetchLocations } = useBookingStore();
onMounted(async () => {
  await fetchLocations();
});
</script>
<template>
  <main class="relative">
    <SectionsOne id="home" />
    <SectionsTwo id="about" />
    <SectionsThree />
    <SectionsFour id="terms" />
    <SectionsFive id="faq" />
    <SectionsSix id="contacts" />
    <div class="fixed right-10 bottom-5 z-30 group">
      <img
        src="@/assets/webp/floating-image.webp"
        alt="floating"
        class="absolute bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 scale-350"
      />
      <div class="relative w-14 h-14">
        <span
          class="absolute inset-0 rounded-full bg-main/50 animate-ping pointer-events-none [animation-delay:0s]"
        />
        <span
          class="group-hover:animate-ping absolute inset-0 rounded-full bg-main/35 pointer-events-none [animation-delay:0.4s]"
        />
        <span
          class="absolute inset-0 rounded-full bg-main/20 group-hover:animate-ping pointer-events-none [animation-delay:0.8s]"
        />

        <NuxtLink
          to="/#findCar"
          class="absolute inset-0 flex items-center justify-center rounded-full bg-main text-white uppercase font-bold text-xs leading-tight overflow-hidden shadow-lg"
        >
          <span class="relative z-10 flex flex-col items-center text-center">
            <span>Find</span>
            <span>car</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
