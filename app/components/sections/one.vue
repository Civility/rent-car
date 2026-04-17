<script setup>
  import {
    differenceInHours,
    isValid,
    parseISO,
    set,
    addHours,
    isSameDay,
    format
  } from "date-fns";
  import { storeToRefs } from "pinia";
  import { useVuelidate } from "@vuelidate/core";
  import { required, requiredIf, helpers } from "@vuelidate/validators";
  import { VueDatePicker } from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import { el } from "date-fns/locale";
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
  const { isDesktop } = useDevice();
  // const {   } = useMainStore();
  const { setSearchForm } = useBookingStore();
  // const { lang } = storeToRefs(useMainStore());
  const { searchForm } = storeToRefs(useBookingStore());

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
  const locationOptions = [
    { value: "SKG", label: "THESSALONIKI AIRPORT SKG" },
    { value: "ATH", label: "ATHENS AIRPORT ATH" },
    { value: "LAG", label: "LAGADAS THESSALONIKI" },
  ];
  // Ловушки на спам
  const startTime = ref(0);
  const trapFieldName = ref("website_url");
  const trapValue = ref("");
  const isConsent = ref(false); // Локальный чекбокс-ловушка

  onMounted(() => {
    startTime.value = Date.now();
    const prefixes = ["website", "company", "url", "fax"];
    trapFieldName.value =
      prefixes[Math.floor(Math.random() * prefixes.length)] +
      "_" +
      Math.random().toString(36).substr(2, 4);
  });

  const form = computed(() => searchForm.value);

  const rules = {
    location: { required },
    returnLocation: {
      required: requiredIf(() => !form.value.differentLocation),
    },
    dateFrom: { required: helpers.withMessage("Select start date", required) },
    timeFrom: { required: helpers.withMessage("Select pickup time", required) },
    dateTo: { required: helpers.withMessage("Select return date", required) },
    timeTo: {
      required: helpers.withMessage("Select return time", required),
      validRange: helpers.withMessage("Min period is 1 hour", () => {
        if (!form) return true;
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
      }),
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

  const minTimeTo = computed(() => {
    if (!form) return null;
    if (!form.value.timeFrom || typeof form.value.timeFrom !== "object")
      return null;
    if (
      !form.value.dateFrom ||
      !form.value.dateTo ||
      formatDate(form.value.dateFrom) !== formatDate(form.value.dateTo)
    )
      return null;

    const base = set(new Date(), {
      hours: form.value.timeFrom.hours,
      minutes: form.value.timeFrom.minutes,
    });
    const plusHour = addHours(base, 1);
    // Проверяем, наступил ли следующий день
    if (!isSameDay(base, plusHour)) return { hours: 24, minutes: 0 };
    return { hours: plusHour.getHours(), minutes: plusHour.getMinutes() };
  });

  const isFormDisabled = computed(() => {
    // Безопасная проверка: если form.value.value еще нет, кнопка недоступна
    if (!form) return true;

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

    await navigateTo("/booking");
  };
</script>

<template>
  <section class="relative grid grid-cols-1">
    <div class="col-start-1 row-start-1 h-full">
      <img
        src="@/assets/webp/intro-bg.webp"
        alt="Background"
        class="h-full w-full object-cover object-center" />
    </div>
    <img
      src="@/assets/webp/intro-leaf.webp"
      alt="leaf"
      class="h-auto lg:w-[20%] w-fit object-cover object-center absolute -bottom-1/5 lg:-bottom-1/4 -left-[5%] z-20 -rotate-15 animate-leaf-orbit" />
    <div
      class="container col-start-1 row-start-1 justify-self-center relative z-10 lg:pt-30 lg:pb-24 pt-10 pb-12">
      <div class="flex flex-col items-center text-white text-center">
        <UISvg
          :svg="ICON_STAR"
          alt="Star"
          class="w-9 h-9" />

        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
          Affordable cars in Rent
          <strong
            class="relative inline-grid place-items-center lg:text-4xl text-lg sm:text-2xl align-middle ml-2">
            <UISvg
              :svg="ICON_BAG"
              class="col-start-1 row-start-1 lg:h-24 lg:w-24 w-16 h-16 text-main-dark animate-rotate-pause-9" />
            <span class="col-start-1 row-start-1 relative z-10">Me</span>
          </strong>
        </h1>

        <p class="text-lg opacity-90 font-semibold lg:block hidden">
          Comfort for your travels and business trips!
        </p>
      </div>

      <div
        class="flex flex-col lg:flex-row justify-between items-center lg:items-start relative gap-4">
        <div class="relative lg:flex lg:max-w-[30%] w-full gap-4 flex-col">
          <img
            src="@/assets/webp/leaf-1.webp"
            alt="leaf-1"
            class="object-cover w-40 h-30 absolute lg:right-3 left-0 lg:left-auto lg:bottom-7 bottom-auto pointer-events-none z-10 animate-leaf-orbit" />

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
              class="hidden lg:block rounded-4xl border-2 border-white/90 shadow-lg overflow-hidden w-full">
              <SwiperSlide
                v-for="img in slider"
                :key="img">
                <img
                  :src="IMG(img)"
                  :alt="img"
                  class="w-full h-full object-cover select-none" />
              </SwiperSlide>
            </Swiper>
          </ClientOnly>
          <img
            src="@/assets/webp/intro-photo-8.webp"
            class="hidden lg:block rounded-4xl border-2 border-white/90 shadow-lg object-cover w-fit" />
          <img
            src="@/assets/webp/leaf-2.webp"
            alt="leaf-2"
            class="object-cover absolute lg:left-20 right-0 lg:-bottom-14 bottom-5 pointer-events-none z-10 animate-leaf-orbit-reverse" />
        </div>

        <div
          class="absolute md:left-1/2 -translate-x-1/2 md:-top-10 pointer-events-none -z-10 md:max-w-6xl lg:max-w-full inset-0">
          <UIInView
            class="absolute lg:inset-0 md:right-1/2 right-1/4 mx-auto lg:mt-[6%] w-50 h-17"
            :speed="0.4">
            <UISvg
              :svg="ICON_DECOR1"
              class="w-full h-full text-transparent" />
          </UIInView>
          <UISvg
            :svg="ICON_DECOR2"
            class="absolute right-[34%] top-[29%] w-25 h-12 text-transparent" />
          <img
            src="~/assets/webp/car.webp"
            alt="car"
            class="w-full h-auto" />
        </div>

        <div
          class="relative w-auto -mx-8 lg:ml-auto lg:mr-0 md:max-w-sm md:p-8 p-4 lg:-mt-5 rounded-4xl bg-white/30 backdrop-blur-none border border-white/40 shadow-2xl bg-linear-to-r from-white/50 from-10% via-white/55 via-45% to-white/75 to-90%">
          <form
            id="findCar"
            class="space-y-4"
            @submit.prevent="handleSubmit">
            <div
              class="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden"
              aria-hidden="true">
              <label for="search-consent">consent to data processing</label>
              <input
                id="search-consent"
                type="checkbox"
                v-model="isConsent"
                tabindex="-1" />

              <label :for="trapFieldName">Leave empty if human</label>
              <input
                :id="trapFieldName"
                type="text"
                :name="trapFieldName"
                v-model="trapValue"
                tabindex="-1"
                autocomplete="off" />
            </div>
            <div>
              <span
                id="label-location"
                class="block text-lg font-bold mb-1 text-zinc-900">
                Pick Up
              </span>

              <div class="relative">
                <UISvg
                  :svg="ICON_GOAL"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none" />

                <div
                  :class="{
                    'ring-2 ring-red-400 rounded-xl': v$.location.$error,
                  }">
                  <UISelect
                    id="location"
                    name="location"
                    aria-labelledby="label-location"
                    v-model="form.location"
                    :options="locationOptions"
                    placeholder="Select location" />
                </div>
              </div>
              <p
                v-for="error in v$.location.$errors"
                :key="error.$uid"
                class="text-red-500 text-xs mt-1">
                {{ error.$message }}
              </p>
            </div>

            <label
              for="differentLocation"
              class="flex items-center space-x-3 cursor-pointer py-1">
              <input
                id="differentLocation"
                name="differentLocation"
                v-model="form.differentLocation"
                type="checkbox"
                class="checkbox-rounded" />

              <span class="text-zinc-800 font-semibold"
                >Same return location</span
              >
            </label>

            <transition name="fade-slide">
              <div v-if="!form.differentLocation">
                <span
                  id="label-returnLocation"
                  class="block text-lg font-bold mb-1 text-zinc-900">
                  Return To
                </span>

                <div class="relative">
                  <UISvg
                    :svg="ICON_GOAL"
                    class="absolute left-2 top-1/2 -translate-y-1/2 w-5! h-auto! text-zinc-400 z-10 pointer-events-none" />

                  <div
                    :class="{
                      'ring-2 ring-red-400 rounded-xl':
                        v$.returnLocation.$error,
                    }">
                    <UISelect
                      id="returnLocation"
                      name="returnLocation"
                      v-model="form.returnLocation"
                      :options="locationOptions"
                      placeholder="Select return location" />
                  </div>
                </div>
                <p
                  v-for="error in v$.returnLocation.$errors"
                  :key="error.$uid"
                  class="text-red-500 text-xs mt-1">
                  {{ error.$message }}
                </p>
              </div>
            </transition>

            <div class="grid grid-cols-1 gap-4">
              <div class="relative">
                <span class="block text-lg font-bold mb-1 text-zinc-900"
                  >Pickup date and time
                </span>
                <div
                  class="relative flex md:flex-nowrap flex-wrap gap-2 w-full">
                  <ClientOnly>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.dateFrom"
                        :min-date="new Date()"
                        :time-config="{ enableTimePicker: false }"
                        placeholder="Pickup date"
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
                        :format-locale="el"
                        :locale="el" />
                      <p
                        v-for="error in v$.dateFrom.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2">
                        {{ error.$message }}
                      </p>
                    </div>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.timeFrom"
                        time-picker
                        :is-24="true"
                        :minutes-increment="30"
                        placeholder="Time"
                        :hide-input-icon="true"
                        :input-attrs="{
                          id: 'timeFrom',
                          name: 'timeFrom',
                          autocomplete: 'off',
                        }"
                        :ui="{
                          input: [
                            'rounded-xl! h-10',
                            v$.timeFrom.$error ? '!border-red-400' : '',
                          ],
                        }">
                        <template #input-icon>
                          <UISvg
                            :svg="ICON_TIME"
                            class="pl-2" />
                        </template>
                      </VueDatePicker>
                      <p
                        v-for="error in v$.timeFrom.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2">
                        {{ error.$message }}
                      </p>
                    </div></ClientOnly
                  >
                </div>
              </div>

              <div class="relative">
                <span
                  id="label-dateTo"
                  class="block text-lg font-bold mb-1 text-zinc-900"
                  >Return date and time</span
                >
                <div
                  class="relative flex md:flex-nowrap flex-wrap gap-2 w-full">
                  <ClientOnly>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.dateTo"
                        :min-date="form.dateFrom || new Date()"
                        auto-apply
                        :time-config="{ enableTimePicker: false }"
                        placeholder="Return date"
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
                        :format-locale="el"
                        :locale="el">
                      </VueDatePicker>
                      <p
                        v-for="error in v$.dateTo.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2">
                        {{ error.$message }}
                      </p>
                    </div>
                    <div class="relative w-full">
                      <VueDatePicker
                        v-model="form.timeTo"
                        time-picker
                        :is-24="true"
                        :minutes-increment="30"
                        :min-time="minTimeTo"
                        placeholder="Time"
                        :hide-input-icon="true"
                        :input-attrs="{
                          id: 'timeTo',
                          name: 'timeTo',
                          autocomplete: 'off',
                        }"
                        :ui="{
                          input: [
                            'rounded-xl! h-10',
                            v$.timeTo.$error ? '!border-red-400' : '',
                          ],
                        }">
                        <template #input-icon>
                          <UISvg
                            :svg="ICON_TIME"
                            class="pl-2" />
                        </template>
                      </VueDatePicker>
                      <p
                        v-for="error in v$.timeTo.$errors"
                        :key="error.$uid"
                        class="text-red-600 text-xs font-bold absolute -bottom-3 left-0 pl-2">
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
                }">
                Show Car
              </UIBtn>

              <div
                v-if="isFormDisabled"
                class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-sm font-semibold py-2 px-4 rounded-lg pointer-events-none whitespace-nowrap z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-zinc-800">
                Please fill in the fields
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
