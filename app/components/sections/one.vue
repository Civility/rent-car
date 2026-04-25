<script setup>
import { differenceInHours, isValid, parseISO, format } from "date-fns";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, helpers } from "@vuelidate/validators";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import ICON_STAR from "@/assets/icons/star.svg";
import ICON_BAG from "@/assets/icons/logo_bag.svg";
import ICON_GOAL from "@/assets/icons/goal.svg";
import ICON_TIME from "@/assets/icons/time.svg";
import ICON_DECOR1 from "@/assets/icons/car-decor-1.svg";
import ICON_DECOR2 from "@/assets/icons/car-decor-2.svg";
// Импорты Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useBookingStore } from "@/store/booking";
// import { useMainStore } from "@/store/main";
import { navigateTo } from "#app";

const { dateLocale } = useDateLocale();
const { isDesktop } = useDevice();
const localePath = useLocalePath();

const {
  fetchLocations,
  setSearchForm,
  setLocation,
  setReturnLocation,
  setDifferentLocation,
} = useBookingStore();
const { searchForm, locations } = storeToRefs(useBookingStore());

onMounted(async () => {
  if (!locations.value.length) await fetchLocations();

  startTime.value = Date.now();
  const prefixes = ["website", "company", "url", "fax"];
  trapFieldName.value =
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    "_" +
    Math.random().toString(36).slice(2, 6);
});

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = (i % 2) * 30;
  const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return { value: `${h}:${m}`, label };
});

const timeToValue = (t) => {
  if (!t || typeof t !== "object") return null;
  return `${t.hours}:${t.minutes}`;
};

const valueToTime = (v) => {
  if (!v) return null;
  const [h, m] = v.split(":").map(Number);
  return { hours: h, minutes: m, seconds: 0 };
};

// slider
const slider = [
  "intro-photo-1",
  "intro-photo-2",
  "intro-photo-3",
  "intro-photo-4",
  "intro-photo-5",
  "intro-photo-6",
  "intro-photo-7",
  "intro-photo-8",
];
// select
// const locationOptions = [
//   { value: "SKG", label: "THESSALONIKI AIRPORT SKG" },
//   { value: "ATH", label: "ATHENS AIRPORT ATH" },
//   { value: "LAG", label: "LAGADAS THESSALONIKI" },
// ];
// const locationOptions = locations.value.map((i) => ({
//   value: i.value,
//   label: i.label,
// }));
// const locationOptions = computed(() => locations.value);
// Ловушки на спам
const startTime = ref(0);
const trapFieldName = ref("website_url");
const trapValue = ref("");
const isConsent = ref(false); // Локальный чекбокс-ловушка

const form = computed(() => searchForm.value);
const { t } = useI18n();
const rules = {
  location: { required },
  returnLocation: {
    required: requiredIf(() => !form.value.differentLocation),
  },
  dateFrom: {
    required: helpers.withMessage(
      () => t("validation.selectStartDate"),
      required,
    ),
  },
  timeFrom: {
    required: helpers.withMessage(
      () => t("validation.selectPickupTime"),
      required,
    ),
  },
  dateTo: {
    required: helpers.withMessage(
      () => t("validation.selectReturnDate"),
      required,
    ),
  },
  timeTo: {
    required: helpers.withMessage(
      () => t("validation.selectReturnTime"),
      required,
    ),
    validRange: helpers.withMessage(
      () => t("validation.minPeriodOneHour"),
      () => {
        if (!form.value) return true;
        if (
          !form.value.dateFrom ||
          !form.value.timeFrom ||
          !form.value.dateTo ||
          !form.value.timeTo
        )
          return true;

        const fromDate = formatDate(form.value.dateFrom);
        const toDate = formatDate(form.value.dateTo);
        const fromTime = formatTime(form.value.timeFrom);
        const toTime = formatTime(form.value.timeTo);

        if (!fromDate || !toDate || !fromTime || !toTime) return true;

        const from = parseISO(`${fromDate}T${fromTime}:00`);
        const to = parseISO(`${toDate}T${toTime}:00`);

        if (!isValid(from) || !isValid(to)) return true;
        return differenceInHours(to, from) >= 1;
      },
    ),
  },
};

const v$ = useVuelidate(rules, form, { $autoDirty: true });

watch(
  () => [form.value.timeFrom, form.value.dateFrom, form.value.dateTo],
  () => {
    if (v$.value.timeTo.$dirty) {
      v$.value.timeTo.$validate();
    }
  },
);

const formatDate = (d) => {
  if (!d) return null;
  return format(new Date(d), "yyyy-MM-dd");
};
const formatTime = (t) => {
  if (!t || typeof t !== "object") return null;
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}`;
};

const getDateTime = (date, time) => {
  if (!date || !time) return null;
  return `${formatDate(date)} ${formatTime(time)}:00`;
};

const isFormDisabled = computed(() => {
  // Безопасная проверка: если form.value.value еще нет, кнопка недоступна
  if (!form.value) return true;

  return (
    !form.value.dateFrom ||
    !form.value.dateTo ||
    !form.value.timeFrom ||
    !form.value.timeTo ||
    v$.value.$error
  );
});

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  // ПРОВЕРКА ЛОВУШЕК НА СПАМ (проверяем локальные ref)
  const timeElapsed = Date.now() - startTime.value;
  if (timeElapsed < 2500 || isConsent.value || trapValue.value !== "") {
    console.log("Spam detected. Blocked silently.");
    return;
  }

  // Сохраняем финальные строки в Store на всякий случай, если нужно
  // (Пока мы это делаем при переходе на /booking, но можно сохранить форматированную дату вместо сложного объекта)
  setSearchForm({
    formattedDateFrom: getDateTime(form.value.dateFrom, form.value.timeFrom),
    formattedDateTo: getDateTime(form.value.dateTo, form.value.timeTo),
  });

  await navigateTo(localePath("/booking"));
};
</script>

<template>
  <section class="relative grid grid-cols-1">
    <div class="col-start-1 row-start-1 h-full">
      <img
        src="@/assets/webp/intro-bg.webp"
        alt="Background"
        aria-hidden="true"
        class="h-full w-full object-cover object-center"
      />
    </div>
    <img
      src="@/assets/webp/intro-leaf.webp"
      alt="leaf"
      aria-hidden="true"
      class="h-auto lg:w-[20%] w-fit object-cover object-center absolute -bottom-1/5 lg:-bottom-1/4 left-[-5%] z-20 -rotate-15 animate-leaf-orbit"
    />
    <div
      class="container col-start-1 row-start-1 justify-self-center relative z-10 lg:pt-30 lg:pb-24 pt-10 pb-12"
    >
      <div class="flex flex-col items-center text-white text-center">
        <UISvg :svg="ICON_STAR" alt="Star" class="w-9 h-9" />

        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
        >
          {{ $t("hero.title") }}
          <strong
            class="relative inline-grid place-items-center lg:text-4xl text-lg sm:text-2xl align-middle ml-2"
          >
            <UISvg
              :svg="ICON_BAG"
              class="col-start-1 row-start-1 lg:h-24 lg:w-24 w-16 h-16 text-main-dark animate-rotate-pause-9"
            />
            <span class="col-start-1 row-start-1 relative z-10">Me</span>
          </strong>
        </h1>

        <p class="text-lg opacity-90 font-semibold lg:block hidden">
          {{ $t("hero.subtitle") }}
        </p>
      </div>

      <div
        class="flex flex-col lg:flex-row justify-between items-center lg:items-start relative gap-4"
      >
        <div class="relative lg:flex lg:max-w-[30%] w-full gap-4 flex-col">
          <img
            src="@/assets/webp/leaf-1.webp"
            alt="leaf-1"
            aria-hidden="true"
            class="object-cover w-40 h-30 absolute lg:right-3 left-0 lg:left-auto lg:bottom-7 bottom-auto pointer-events-none z-10 animate-leaf-orbit"
          />

          <ClientOnly>
            <Swiper
              v-if="isDesktop"
              :modules="[Autoplay, EffectFade]"
              effect="fade"
              :speed="2000"
              :fade-effect="{ crossFade: true }"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              :loop="true"
              :allow-touch-move="true"
              class="hidden lg:block rounded-4xl border-2 border-white/90 shadow-lg overflow-hidden w-full"
            >
              <SwiperSlide v-for="img in slider" :key="img">
                <img
                  :src="IMG(img)"
                  :alt="img"
                  aria-hidden="true"
                  class="w-full h-full object-cover select-none"
                />
              </SwiperSlide>
            </Swiper>
          </ClientOnly>
          <img
            src="@/assets/webp/intro-photo-8.webp"
            aria-hidden="true"
            alt="Rental car available in Thessaloniki"
            class="hidden lg:block rounded-4xl border-2 border-white/90 shadow-lg object-cover w-fit"
          />
          <img
            src="@/assets/webp/leaf-2.webp"
            aria-hidden="true"
            alt="Rental car"
            class="object-cover absolute lg:left-20 right-0 lg:-bottom-14 bottom-5 pointer-events-none z-10 animate-leaf-orbit-reverse"
          />
        </div>

        <div
          class="absolute md:left-1/2 -translate-x-1/2 md:-top-10 pointer-events-none -z-10 md:max-w-6xl lg:max-w-full inset-0"
        >
          <UIInView
            class="absolute lg:inset-0 md:right-1/2 right-1/4 mx-auto lg:mt-[6%] w-50 h-17"
            :speed="0.4"
          >
            <UISvg :svg="ICON_DECOR1" class="w-full h-full text-transparent" />
          </UIInView>
          <UISvg
            :svg="ICON_DECOR2"
            class="absolute right-[34%] top-[29%] w-25 h-12 text-transparent"
          />
          <img src="~/assets/webp/car.webp" alt="car" class="w-full h-auto" />
        </div>

        <div
          class="relative w-auto -mx-8 lg:ml-auto lg:mr-0 md:max-w-sm md:p-8 p-4 lg:-mt-5 rounded-4xl bg-white/30 backdrop-blur-none border border-white/40 shadow-2xl bg-linear-to-r from-white/50 from-10% via-white/55 via-45% to-white/75 to-90%"
        >
          <form id="findCar" class="space-y-4" @submit.prevent="handleSubmit">
            <div
              class="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden"
              aria-hidden="true"
            >
              <label for="search-consent">consent to data processing</label>
              <input
                id="search-consent"
                v-model="isConsent"
                type="checkbox"
                tabindex="-1"
              />

              <label :for="trapFieldName">Leave empty if human</label>
              <input
                :id="trapFieldName"
                v-model="trapValue"
                type="text"
                :name="trapFieldName"
                tabindex="-1"
                autocomplete="off"
              />
            </div>
            <div>
              <span
                id="label-location"
                class="block text-lg font-bold mb-1 text-zinc-900"
              >
                {{ $t("hero.pickUp") }}
              </span>

              <div class="relative">
                <UISvg
                  :svg="ICON_GOAL"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none"
                />

                <div
                  :class="{
                    'ring-2 ring-red-400 rounded-xl': v$.location.$error,
                  }"
                >
                  <UISelect
                    id="location"
                    :model-value="form.location"
                    name="location"
                    aria-labelledby="label-location"
                    :options="locations"
                    :placeholder="$t('hero.selectLocation')"
                    @update:model-value="setLocation"
                  />
                </div>
              </div>
              <p
                v-for="error in v$.location.$errors"
                :key="error.$uid"
                class="text-red-500 text-xs mt-1"
              >
                {{ error.$message }}
              </p>
            </div>

            <label
              for="differentLocation"
              class="flex items-center space-x-3 cursor-pointer py-1"
            >
              <input
                id="differentLocation"
                :checked="form.differentLocation"
                name="differentLocation"
                type="checkbox"
                class="checkbox-rounded"
                @change="setDifferentLocation($event.target.checked)"
              />

              <span class="text-zinc-800 font-semibold">{{
                $t("hero.sameReturn")
              }}</span>
            </label>

            <transition name="fade-slide">
              <div v-if="!form.differentLocation">
                <span
                  id="label-returnLocation"
                  class="block text-lg font-bold mb-1 text-zinc-900"
                >
                  {{ $t("hero.returnTo") }}
                </span>

                <div class="relative">
                  <UISvg
                    :svg="ICON_GOAL"
                    class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none"
                  />

                  <div
                    :class="{
                      'ring-2 ring-red-400 rounded-xl':
                        v$.returnLocation.$error,
                    }"
                  >
                    <UISelect
                      id="returnLocation"
                      :model-value="form.returnLocation"
                      name="returnLocation"
                      :options="locations"
                      :placeholder="$t('hero.selectReturnLocation')"
                      @update:model-value="setReturnLocation"
                    />
                  </div>
                </div>
                <p
                  v-for="error in v$.returnLocation.$errors"
                  :key="error.$uid"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ error.$message }}
                </p>
              </div>
            </transition>

            <div class="grid grid-cols-1 gap-4">
              <div class="relative">
                <span class="block text-lg font-bold mb-1 text-zinc-900"
                  >{{ $t("hero.pickupDateTime") }}
                </span>
                <div
                  class="relative flex md:flex-nowrap flex-wrap gap-2 w-full"
                >
                  <ClientOnly>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.dateFrom"
                        :min-date="new Date()"
                        :time-config="{ enableTimePicker: false }"
                        :placeholder="$t('hero.pickupDate')"
                        disable-year-select
                        :is-24="true"
                        auto-apply
                        :input-attrs="{
                          id: 'dateFrom',
                          name: 'dateFrom',
                          autocomplete: 'off',
                        }"
                        :ui="{
                          input: [
                            'rounded-xl! h-10',
                            v$.dateFrom.$error ? '!border-red-400' : '',
                          ],
                        }"
                        :format-locale="dateLocale"
                        :locale="dateLocale"
                      />
                      <p
                        v-for="error in v$.dateFrom.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                    <div class="relative w-full">
                      <UISvg
                        :svg="ICON_TIME"
                        class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none"
                      />
                      <div
                        :class="{
                          'ring-2 ring-red-400 rounded-xl': v$.timeFrom.$error,
                        }"
                      >
                        <UISelect
                          id="timeFrom"
                          :model-value="timeToValue(form.timeFrom)"
                          :options="timeSlots"
                          placeholder="Time"
                          class="[&_.ui-select>div]:pl-8! [&_.max-h-60]:max-h-40!"
                          @update:model-value="
                            (v) => setSearchForm({ timeFrom: valueToTime(v) })
                          "
                        />
                      </div>
                      <p
                        v-for="error in v$.timeFrom.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </ClientOnly>
                </div>
              </div>

              <div class="relative">
                <span
                  id="label-dateTo"
                  class="block text-lg font-bold mb-1 text-zinc-900"
                  >{{ $t("hero.returnDateTime") }}</span
                >
                <div
                  class="relative flex md:flex-nowrap flex-wrap gap-2 w-full"
                >
                  <ClientOnly>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.dateTo"
                        :min-date="form.dateFrom || new Date()"
                        auto-apply
                        :time-config="{ enableTimePicker: false }"
                        :placeholder="$t('hero.returnDate')"
                        disable-year-select
                        :is-24="true"
                        :input-attrs="{
                          id: 'dateTo',
                          name: 'dateTo',
                          ariaLabelledby: 'label-dateTo',
                        }"
                        :ui="{
                          input: [
                            'relative rounded-xl! h-10',
                            v$.dateTo.$error ? '!border-red-400' : '',
                          ],
                        }"
                        :format-locale="dateLocale"
                        :locale="dateLocale"
                      />
                      <p
                        v-for="error in v$.dateTo.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                    <div class="relative w-full">
                      <UISvg
                        :svg="ICON_TIME"
                        class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none"
                      />
                      <div
                        :class="{
                          'ring-2 ring-red-400 rounded-xl': v$.timeTo.$error,
                        }"
                      >
                        <UISelect
                          id="timeTo"
                          :model-value="timeToValue(form.timeTo)"
                          :options="timeSlots"
                          :placeholder="$t('common.time')"
                          class="[&_.ui-select>div]:pl-8! [&_.max-h-60]:max-h-40!"
                          @update:model-value="
                            (v) => setSearchForm({ timeTo: valueToTime(v) })
                          "
                        />
                      </div>
                      <p
                        v-for="error in v$.timeTo.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </ClientOnly>
                </div>
              </div>
            </div>

            <div class="relative group w-full">
              <UIBtn
                type="submit"
                main
                class="w-full text-lg font-black uppercase transition-colors"
                :disabled="isFormDisabled"
                :class="{
                  'opacity-50 bg-zinc-500! cursor-not-allowed': isFormDisabled,
                }"
              >
                {{ $t("hero.showCar") }}
              </UIBtn>

              <div
                v-if="isFormDisabled"
                class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-sm font-semibold py-2 px-4 rounded-lg pointer-events-none whitespace-nowrap z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-zinc-800"
              >
                {{ $t("hero.fillFields") }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
