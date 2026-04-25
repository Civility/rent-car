<script setup>
import { useMainStore } from "@/store/main";
import { storeToRefs } from "pinia";

const main = useMainStore();
const { isLoading: isApiLoading } = storeToRefs(main);

const show = computed(() => isApiLoading.value);
</script>

<template>
  <Transition name="preloader-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <img
        src="@/assets/webp/leaf-1.webp"
        alt=""
        class="preloader-leaf w-32 md:w-48 h-auto select-none pointer-events-none"
      />
    </div>
  </Transition>
</template>

<style scoped>
.preloader-leaf {
  animation: leaf-fall 2.4s ease-in-out infinite;
  transform-origin: center;
  will-change: transform, opacity;
}

@keyframes leaf-fall {
  0% {
    transform: translateY(-40vh) rotate(-20deg);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translateY(0) rotate(15deg);
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(40vh) rotate(-10deg);
    opacity: 0;
  }
}

.preloader-fade-enter-active,
.preloader-fade-leave-active {
  transition: opacity 0.35s ease;
}
.preloader-fade-enter-from,
.preloader-fade-leave-to {
  opacity: 0;
}
</style>
