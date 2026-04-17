<script setup>
  import LOGO_CARDECOR from "@/assets/icons/car-decor-2.svg";

  const footerRef = ref(null);
  const isAnimated = ref(false);
  const showDecor = ref(false);
  let decorTimeout = null;
  useInView(
    footerRef,
    (isIntersecting) => {
      if (isIntersecting) {
        isAnimated.value = true;
        // Запускаем таймер декораций
        if (!showDecor.value) {
          decorTimeout = setTimeout(() => {
            showDecor.value = true;
          }, 3000);
        }
      } else {
        // Сброс при уходе с экрана
        isAnimated.value = false;
        showDecor.value = false;
        if (decorTimeout) clearTimeout(decorTimeout);
      }
    },
    { threshold: 0, rootMargin: "200px 0px 0px 0px" },
  );
</script>

<template>
  <footer
    ref="footerRef"
    class="bg-[#efefef]">
    <div class="grid grid-cols-12">
      <div
        class="col-span-8 py-12 lg:py-20 relative overflow-hidden border-t bg-linear-to-r from-[#b63b11] from-20% via-[#ff9049] via-50% to-[#b24317] to-90%">
        <!-- Блок с машиной (машина спрятана, пока не начнется анимация) -->
        <div
          class="absolute bottom-0 -left-[10vw] w-[52vw] pointer-events-none z-10 transition-opacity duration-300"
          :class="isAnimated ? 'animate-drive-in opacity-100' : 'opacity-0'">
          <!-- Кузов машины -->
          <img
            src="@/assets/webp/footer-car.webp"
            alt="footer-car"
            class="w-full relative z-10" />

          <!-- Заднее колесо -->
          <img
            src="@/assets/webp/car-wheel.webp"
            alt="rear-wheel"
            class="absolute w-[12.5%] left-[15.5%] bottom-[3%] z-20 origin-center"
            :class="{ 'animate-spin-stop': isAnimated }" />

          <!-- Переднее колесо -->
          <img
            src="@/assets/webp/car-wheel.webp"
            alt="front-wheel"
            class="absolute w-[12.5%] right-[25%] bottom-[3%] z-20 origin-center"
            :class="{ 'animate-spin-stop': isAnimated }" />

          <UIInView
            v-show="showDecor"
            class="absolute md:right-0 -right-1/3 -top-15 md:top-1/6 w-30 h-20 rotate-30"
            :speed="0.5">
            <UISvg
              :svg="LOGO_CARDECOR"
              class="w-full h-full text-transparent stroke-smoke stroke-2" />
          </UIInView>
        </div>

        <!-- Контент -->
        <div class="relative z-20 px-4 text-left w-60 ml-auto">
          <strong class="mb-4 block">
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our Privacy Policy (opens in a new tab)">
              Privacy Policy
            </a>
          </strong>
          <p class="text-sm text-dark font-medium">
            &copy; {{ new Date().getFullYear() }} RentMe Car Rental.
          </p>
        </div>
      </div>
      <div class="relative col-span-4 ml-auto">
        <img
          src="@/assets/webp/leaf-1.webp"
          alt="footer-leaf-1"
          class="object-cover absolute -left-1/2 top-5 w-25 h-25 pointer-events-none z-10 animate-leaf-orbit" />
        <img
          src="@/assets/webp/car-marks.webp"
          alt="car-marks"
          class="w-fit h-full object-cover pointer-events-none" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
  /* Анимация выезда машины */
  @keyframes drive-in {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(0);
    }
  }

  /* Анимация вращения колес, которая плавно останавливается */
  @keyframes spin-stop {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1080deg); /* 3 полных оборота (360 * 3) */
    }
  }

  .animate-drive-in {
    animation: drive-in 3s ease-out forwards;
  }

  .animate-spin-stop {
    animation: spin-stop 3s ease-out forwards;
  }
</style>
