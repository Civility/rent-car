<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, helpers } from "@vuelidate/validators";

import ICON_STAR from "@/assets/icons/star.svg";
import ICON_BAG from "@/assets/icons/logo_bag.svg";
import ICON_GOAL from "@/assets/icons/goal.svg";
import ICON_CALENDAR from "@/assets/icons/calendar.svg";

const form = reactive({
  location: "SKG",
  differentLocation: false,
  returnLocation: "SKG",
  dateFrom: "",
  dateTo: "",
});

const getIsoDateTime = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 16);
};
const minDateTimeFrom = computed(() => {
  return getIsoDateTime(roundTo30(new Date()));
});

const minDateTimeTo = computed(() => {
  if (!form.dateFrom) return minDateTimeFrom.value;

  const d = new Date(form.dateFrom);
  d.setHours(d.getHours() + 1);

  return getIsoDateTime(roundTo30(d));
});
const normalizeDate = (field) => {
  if (!form[field]) return;
  form[field] = getIsoDateTime(roundTo30(new Date(form[field])));
};
const minOneHourDiff = (value) => {
  if (!value || !form.dateFrom) return true;
  return new Date(value) - new Date(form.dateFrom) >= 3600000;
};
const roundTo30 = (date = new Date()) => {
  const d = new Date(date);

  const minutes = d.getMinutes();
  const remainder = minutes % 30;

  if (remainder !== 0) {
    d.setMinutes(minutes + (30 - remainder));
  }

  d.setSeconds(0);
  d.setMilliseconds(0);

  return d;
};
const rules = {
  location: { required },
  returnLocation: {
    required: requiredIf(() => form.differentLocation),
  },
  dateFrom: { required: helpers.withMessage("Select start date", required) },
  dateTo: {
    required: helpers.withMessage("Select return date", required),
    minOneHourDiff: helpers.withMessage("Min 1 hour rental", minOneHourDiff),
  },
};

const v$ = useVuelidate(rules, form);

const handlePicker = (e) => {
  const input = e.target;

  if (typeof input.showPicker === "function") {
    // Если этот инпут уже является активным элементом (т.е. календарь открыт)
    if (document.activeElement === input) {
      input.blur(); // Снимаем фокус — календарь закроется
    } else {
      input.showPicker(); // Открываем календарь
    }
  }
};

const handleSubmit = () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    console.log("Success:", form);
  }
};

// select

const locationOptions = [
  { value: "SKG", label: "THESSALONIKI AIRPORT SKG" },
  { value: "ATH", label: "ATHENS AIRPORT ATH" },
  { value: "LAG", label: "LAGADAS THESSALONIKI" },
];
</script>

<template>
  <section class="relative grid w-full overflow-hidden min-h-screen">
    <div class="col-start-1 row-start-1 h-full w-full">
      <img
        src="~/assets/webp/intro-bg.webp"
        alt="Background"
        class="h-full w-full object-cover object-center"
      />
    </div>

    <div
      class="col-start-1 row-start-1 relative z-10 lg:pt-30 pt-24 container mx-auto px-4"
    >
      <div
        class="flex flex-col items-center text-white text-center mb-5 lg:mb-8"
      >
        <UISvg :svg="ICON_STAR" alt="Star" class="w-9 h-9" />

        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
        >
          Affordable cars in Rent
          <strong
            class="relative inline-grid place-items-center lg:text-4xl text-2xl align-middle ml-2"
          >
            <UISvg
              :svg="ICON_BAG"
              class="col-start-1 row-start-1 lg:h-24 lg:w-24 w-16 h-16 text-main-dark animate-rotate-pause-9"
            />
            <span class="col-start-1 row-start-1 relative z-10">Me</span>
          </strong>
        </h1>

        <p class="text-lg opacity-90 font-semibold lg:block hidden">
          Comfort for your travels and business trips!
        </p>
      </div>

      <div
        class="flex flex-col lg:flex-row justify-between items-center lg:items-start relative gap-10"
      >
        <div class="hidden lg:flex max-w-[30%] gap-4 flex-col">
          <img
            src="~/assets/webp/intro-photo-1.webp"
            class="rounded-4xl border-2 border-white/90 shadow-lg object-cover"
          />
          <img
            src="~/assets/webp/intro-photo-8.webp"
            class="rounded-4xl border-2 border-white/90 shadow-lg object-cover w-fit"
          />
        </div>

        <div
          class="absolute left-1/2 -translate-x-1/2 -top-10 pointer-events-none -z-10 w-full max-w-6xl"
        >
          <img src="~/assets/webp/car.webp" alt="car" class="w-full h-auto" />
        </div>

        <div
          class="relative w-full max-w-sm p-8 lg:-mt-5 rounded-4xl bg-white/30 backdrop-blur-none border border-white/40 shadow-2xl bg-[linear-gradient(223deg,rgba(255,255,255,0.74)_45.1%,rgba(255,255,255,0)_100%)]"
        >
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-lg font-bold mb-1 text-zinc-900">
                Pick Up
              </label>

              <div class="relative">
                <UISvg
                  :svg="ICON_GOAL"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 z-10 pointer-events-none"
                />

                <UISelect
                  v-model="form.location"
                  :options="locationOptions"
                  placeholder="Select location"
                />
              </div>
            </div>

            <label class="flex items-center space-x-3 cursor-pointer py-1">
              <input
                v-model="form.differentLocation"
                type="checkbox"
                class="w-5 h-5 rounded-xl border-gray-300 text-main cursor-pointer"
              />
              <span class="text-zinc-800 font-medium"
                >I want to return to different location</span
              >
            </label>

            <transition name="fade-slide">
              <div v-if="form.differentLocation">
                <label class="block text-lg font-bold mb-1 text-zinc-900">
                  Return to
                </label>

                <div class="relative">
                  <UISvg
                    :svg="ICON_GOAL"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 z-10 pointer-events-none"
                  />

                  <UISelect
                    v-model="form.returnLocation"
                    :options="locationOptions"
                    placeholder="Select return location"
                  />
                </div>
              </div>
            </transition>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-lg font-bold mb-1 text-zinc-900"
                  >Date From</label
                >
                <div class="relative">
                  <UISvg
                    :svg="ICON_CALENDAR"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 z-10 pointer-events-none"
                  />
                  <input
                    v-model="form.dateFrom"
                    type="datetime-local"
                    :min="minDateTimeFrom"
                    step="1800"
                    class="w-full h-10 pl-12 pr-4 rounded-xl bg-white border-none text-zinc-700 cursor-pointer outline-none"
                    @change="normalizeDate('dateFrom')"
                    @click="handlePicker"
                  />
                </div>
              </div>

              <div>
                <label class="block text-lg font-bold mb-1 text-zinc-900"
                  >Date To</label
                >
                <div class="relative">
                  <UISvg
                    :svg="ICON_CALENDAR"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 z-10 pointer-events-none"
                  />
                  <input
                    v-model="form.dateTo"
                    type="datetime-local"
                    :min="minDateTimeTo"
                    step="1800"
                    class="w-full h-10 pl-12 pr-4 rounded-xl bg-white border-none text-zinc-700 cursor-pointer outline-none"
                    @change="normalizeDate('dateTo')"
                    @click="handlePicker"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="v$.$error"
              class="bg-red-50 p-2 rounded-xl border border-red-200"
            >
              <p
                v-for="error of v$.$errors"
                :key="error.$uid"
                class="text-red-600 text-xs font-bold"
              >
                {{ error.$message }}
              </p>
            </div>

            <UIBtn
              type="submit"
              main
              class="w-full text-lg font-black uppercase transition-colors"
            >
              Show Car
            </UIBtn>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
