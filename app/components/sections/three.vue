<script setup>
  import { animate } from "animejs";
  import LOGO_ICON0 from "@/assets/icons/benefit__icon.svg";
  import LOGO_ICON1 from "@/assets/icons/benefit__icon1.svg";
  import LOGO_ICON2 from "@/assets/icons/benefit__icon2.svg";
  import LOGO_ICON3 from "@/assets/icons/benefit__icon3.svg";
  import LOGO_ICON4 from "@/assets/icons/benefit__icon4.svg";
  import LOGO_ICON5 from "@/assets/icons/benefit__icon5.svg";
  import LOGO_CARDECOR from "@/assets/icons/car-decor-2.svg";
  import LOGO_RENTME from "@/assets/icons/rent_me.svg";

  const benefit = [
    {
      svg: LOGO_ICON0,
      title: "Assortment",
      text: "Wide selection of cars for rental and sale.",
      speed: 0.15,
    },
    {
      svg: LOGO_ICON1,
      title: "Quality",
      text: "Professional car servicing.",
      speed: 0.35,
    },
    {
      svg: LOGO_ICON2,
      title: "Speed",
      text: "Fast and easy rental procedure.",
      speed: 0.2,
    },
    {
      svg: LOGO_ICON3,
      title: "Affordability",
      text: "Optimal pricing offers.",
      speed: 0.25,
    },
    {
      svg: LOGO_ICON4,
      title: "Service",
      text: "Continuous customer support.",
      speed: 0.3,
    },
    {
      svg: LOGO_ICON5,
      title: "Additional services",
      text: "Optional additional options.",
      speed: 0.15,
    },
  ];
  const carSection = ref(null);
  const rentmeRef = ref(null);
  const carDecorRef = ref(null);

  useInView(
    carSection,
    async (isIntersecting) => {
      if (isIntersecting) {
        await nextTick();
        if (!rentmeRef.value || !carDecorRef.value) return;

        animate(carSection.value, {
          translateX: ["200px", "0px"],
          opacity: [0, 1],
          duration: 900,
        });
        animate(rentmeRef.value, {
          opacity: [0, 1],
          translateY: ["10px", "0px"],
          duration: 600,
          delay: 1000,
        });
        animate(carDecorRef.value, {
          opacity: [0, 1],
          translateY: ["10px", "0px"],
          duration: 600,
          delay: 1500,
        });
      } else {
        if (!carSection.value || !rentmeRef.value || !carDecorRef.value) return;

        animate(carSection.value, {
          opacity: 0,
          translateX: "200px",
          duration: 0,
        });
        animate(rentmeRef.value, {
          opacity: 0,
          translateY: "10px",
          duration: 0,
        });
        animate(carDecorRef.value, {
          opacity: 0,
          translateY: "10px",
          duration: 0,
        });
      }
    },
    { threshold: 0.2 },
  );
</script>
<template>
  <section class="md:pt-20 pb-20 md:pb-30 lg:pb-50">
    <div class="relative lg:container lg:mx-auto px-4">
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-medium mb-12 lg:mb-20">
        <span class="text-main">Why</span> choose Rent Me?
      </h2>
      <div
        class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-2 gap-7 md:gap-14">
        <div
          v-for="(item, index) in benefit"
          :key="index"
          class="flex flex-row lg:flex-col items-start gap-5">
          <UIInView
            :speed="item.speed"
            class="md:w-36 md:h-36 w-18 h-18 shrink-0 bg-main-darkser rounded-4xl flex justify-center items-center">
            <UISvg
              :svg="item.svg"
              class="text-transparent md:w-23 w-16 md:h-23 h-16" />
          </UIInView>
          <div>
            <strong
              v-text="item.title"
              class="text-xl leading-5 mb-2.5 block" />
            <p
              v-text="item.text"
              class="leading-7" />
          </div>
        </div>
      </div>

      <div
        ref="carSection"
        style="opacity: 0"
        class="relative pointer-events-none -z-10 right-0 lg:-right-2/6 lg:pt-20 pb-4 lg:absolute lg:top-[40%]">
        <img
          src="@/assets/webp/benefits-car.webp"
          alt="benefits-car"
          class="w-full h-full object-cover" />
        <div
          ref="rentmeRef"
          style="opacity: 0"
          class="absolute top-auto left-0 lg:-left-[2%] lg:top-2/5">
          <UISvg
            :svg="LOGO_RENTME"
            class="text-dark w-30 h-20 md:w-50" />
        </div>
        <div
          ref="carDecorRef"
          style="opacity: 0"
          class="hidden md:block absolute top-[60%] -left-[2%] md:-left-[5%] lg:left-0 lg:top-3/5">
          <UISvg
            :svg="LOGO_CARDECOR"
            class="text-dark -rotate-120 w-30 h-20 md:w-50" />
        </div>
      </div>
      <img
        src="@/assets/webp/intro-leaf.webp"
        alt="benefits-leaf"
        class="h-auto w-[40%] md:w-[30%] lg:w-[20%] object-center absolute -right-20 lg:-right-[15vw] bottom-0 lg:-bottom-[45%] z-10 rotate-120 animate-leaf-orbit" />
      <img
        src="@/assets/webp/leaf-2.webp"
        alt="benefits-leaf-2"
        class="object-cover h-10 absolute z-10 lg:-bottom-[15%] lg:left-[45%] bottom-[15%] left-[10%] animate-leaf-orbit" />
    </div>
  </section>
</template>
