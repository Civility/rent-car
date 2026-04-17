<script setup>
  // const { isDesktop } = useDevice();
  const about = [
    {
      img: "about-1",
      text: "Rent Me is a car rental service that will make any trip or business travel more comfortable and cost-effective.",
    },
    {
      img: "about-2",
      text: "Rent Me offers a wide selection of vehicles that undergo regular maintenance and cleaning. Therefore, you can always be confident in the reliability, safety, and cleanliness of the rented car.",
    },
    {
      img: "about-3",
      text: "Additionally, Rent Me provides vehicle sales services. We will help you choose a car that fits any budget and taste, so you can enjoy complete freedom of movement wherever you are.",
    },
  ];
</script>
<template>
  <section class="pt-20 md:pb-50 pb-4">
    <div class="lg:container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-main mb-10">
        About Us
      </h2>
      <div
        class="relative flex gap-6 md:gap-y-16 lg:gap-6 flex-col lg:flex-row [counter-reset:section]">
        <div
          class="absolute lg:-bottom-1/2 lg:left-1/5 -z-10 w-65 h-65 md:scale-100 scale-75 md:-bottom-1/5 md:left-1/2 bottom-1/5 left-3/5">
          <PartLogo
            class="w-65 h-65 -z-10"
            class1="hidden!"
            class2="text-smoke-dark! w-60 h-60"
            class3="text-smoke-dark! w-60 h-60" />
          <img
            src="@/assets/webp/logo-car.webp"
            alt="logo-car"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
          <img
            src="@/assets/webp/leaf-5.webp"
            alt="leaf-5"
            class="absolute top-1/2 md:-right-2/5 right-0 z-10 -scale-x-100 animate-leaf-orbit-reverse" />
          <img
            src="@/assets/webp/leaf-1.webp"
            alt="about-leaf"
            class="absolute md:top-1/5 -top-1/8 -left-2/5 z-10 rotate-45 scale-70 animate-leaf-orbit" />
        </div>

        <div
          v-for="(item, index) in about"
          :key="index"
          class="relative flex lg:flex-col flex-col md:flex-row items-center lg:items-start md:flex-1 gap-10 md:gap-6 lg:gap-y-16 border-b last:border-none md:border-none pb-6 md:pb-0"
          :class="index % 2 === 1 ? 'lg:flex-col-reverse' : 'lg:flex-col'">
          <div
            class="relative w-3/4 md:w-2/5 lg:w-full [counter-increment:section] before:[content:counter(section,decimal-leading-zero)] before:absolute before:-bottom-1/7 before:left-0 before:font-medium before:z-10 before:text-8xl before:text-main/80">
            <ClientOnly>
              <div class="relative rounded-4xl overflow-hidden shadow-2xl">
                <UIParallax
                  sticky
                  x="20"
                  y="0"
                  class="w-full h-full mix-blend-multiply">
                  <img
                    :src="IMG(item.img)"
                    :alt="item.img"
                    class="w-full h-full object-cover scale-125" />
                </UIParallax>
              </div>
            </ClientOnly>
          </div>
          <p
            v-text="item.text"
            class="md:max-w-1/2 lg:max-w-full max-w-4/5" />
        </div>
      </div>
    </div>
  </section>
</template>
