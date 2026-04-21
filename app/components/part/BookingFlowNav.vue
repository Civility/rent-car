<script setup>
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useBookingStore } from "@/store/booking";

const route = useRoute();
const { searchForm } = storeToRefs(useBookingStore());

const isBookingFlow = computed(() => {
  return route.path === "/booking" || route.path === "/booking/order";
});

const hasDates = computed(() => {
  return Boolean(searchForm.value.dateFrom && searchForm.value.dateTo);
});

const hasSelectedCar = computed(() => {
  return Boolean(searchForm.value.auto?.id);
});

const currentStep = computed(() => {
  if (route.path === "/booking/order") return 3;
  if (route.path === "/booking") return 2;
  return 1;
});

const steps = computed(() => [
  {
    id: 1,
    label: "Choose dates",
    to: "/#home",
    enabled: true,
    done: hasDates.value,
    active: currentStep.value === 1,
  },
  {
    id: 2,
    label: "Choose car",
    to: "/booking",
    enabled: hasDates.value,
    done: hasSelectedCar.value,
    active: currentStep.value === 2,
  },
  {
    id: 3,
    label: "Driver details",
    to: "/booking/order",
    enabled: hasSelectedCar.value,
    done: false,
    active: currentStep.value === 3,
  },
]);
const navRef = ref(null);

const centerActiveStep = async () => {
  await nextTick();

  const activeStep = navRef.value?.querySelector('[data-step-active="true"]');
  activeStep?.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
};

watch(() => route.path, centerActiveStep, { immediate: true });
</script>

<template>
  <div v-if="isBookingFlow" class="w-full border-t border-white/10 z-50">
    <div class="container mx-auto px-4 py-3">
      <nav
        ref="navRef"
        aria-label="Booking steps"
        class="flex items-center justify-center overflow-x-auto rounded-5xl"
      >
        <template v-for="step in steps" :key="step.id">
          <NuxtLink
            v-if="step.enabled"
            :to="step.to"
            class="shrink-0 inline-flex items-center gap-1 md:px-4 px-2 md:py-2 py-1 md:text-sm text-xs font-semibold transition-colors"
            :class="[
              step.active
                ? 'bg-white text-[#8b1504]'
                : step.done
                  ? 'bg-white/15 text-white hover:bg-white/20'
                  : 'bg-white/8 text-white/80 hover:bg-white/14',
            ]"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              :class="[
                step.active
                  ? 'bg-[#8b1504] text-white'
                  : step.done
                    ? 'bg-green-500 text-white'
                    : 'bg-white/15 text-white',
              ]"
            >
              <span v-if="step.done && !step.active">✓</span>
              <span v-else>{{ step.id }}</span>
            </span>
            <span>{{ step.label }}</span>
          </NuxtLink>

          <span
            v-else
            class="shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-white/5 text-white/40 cursor-not-allowed"
          >
            <span
              class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-white/10 text-white/50"
            >
              {{ step.id }}
            </span>
            <span>{{ step.label }}</span>
          </span>

          <!-- <span v-if="index < steps.length - 1" class="text-white/35 shrink-0">
            /
          </span> -->
        </template>
      </nav>
    </div>
  </div>
</template>
