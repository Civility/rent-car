<script setup>
import ICON_CAR_PLACEHOLDER from "@/assets/icons/car-placeholder.svg";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { storeToRefs } from "pinia";
import { useBookingStore } from "@/store/booking";
import { useRouter } from "vue-router";
const router = useRouter();
const bookingStore = useBookingStore();
const { setSearchForm, fetchCars } = bookingStore;
const { searchForm, cars } = storeToRefs(bookingStore);
const localePath = useLocalePath();
// --- Composables ---
const { getCarPricing } = useCarPricing();
const { useRentalDays } = useBookingDates();
const rentalDays = useRentalDays(searchForm);
const { t } = useI18n();
// --- Guard + загрузка машин ---
onMounted(async () => {
  if (searchForm.value.dateFrom === null || searchForm.value.dateTo === null) {
    router.push(localePath("/"));
    return;
  }

  await fetchCars();
});

const handleSelectCar = (car) => {
  setSearchForm({ auto: car });
  router.push(localePath("/booking/order"));
};

// --- Опции для UI ---
// const sortOptions = [
//   { label: "Best deals", value: "discount" },
//   { label: "Lower price", value: "price_asc" },
//   { label: "Higher price", value: "price_desc" },
//   { label: "Recommended", value: "recommended" },
// ];
const sortOptions = computed(() => [
  { label: t("booking.sortOptions.bestDeals"), value: "discount" },
  { label: t("booking.sortOptions.lowerPrice"), value: "price_asc" },
  { label: t("booking.sortOptions.higherPrice"), value: "price_desc" },
  { label: t("booking.sortOptions.recommended"), value: "recommended" },
]);
const benefits = computed(() => [
  t("booking.benefits.unlimitedMileage"),
  t("booking.benefits.basicProtection"),
  t("booking.benefits.freeCancellation"),
]);

const transmissionOptions = computed(() => [
  { label: t("booking.transmissionOptions.automatic"), value: "A" },
  { label: t("booking.transmissionOptions.manual"), value: "M" },
  { label: t("booking.transmissionOptions.both"), value: "both" },
]);

const typeOptions = computed(() => [
  { label: t("booking.typeOptions.car"), value: "car" },
  { label: t("booking.typeOptions.vans"), value: "vans" },
  { label: t("booking.typeOptions.premium"), value: "premium" },
]);

// --- Слайдер карточки / fullscreen ---
const activeSliderId = ref(null);
const fullscreenCar = ref(null);
const fullscreenStartIndex = ref(0);
useHead(() => ({
  htmlAttrs: {
    class: fullscreenCar.value ? "overflow-y-hidden" : "",
  },
}));
const activateSlider = (car) => {
  if (car.images && car.images.length > 0) {
    activeSliderId.value = car.id;
  }
};

const openFullscreenSlider = (car, startIndex = 0) => {
  if (!car.images?.length) return;

  fullscreenCar.value = car;
  fullscreenStartIndex.value = startIndex;
  document.body.style.overflow = "hidden";
};

const closeFullscreenSlider = () => {
  fullscreenCar.value = null;
  fullscreenStartIndex.value = 0;
  document.body.style.overflow = "";
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

// --- Фильтры ---
const seatMinMap = [2, 4, 5, 7];

const getDefaultSeatIndex = () => {
  if (!cars.value.length) return 0;

  const minSeats = Math.min(
    ...cars.value.map((car) => car.features?.seats ?? 0),
  );

  let bestIndex = 0;
  for (let index = seatMinMap.length - 1; index >= 0; index--) {
    if (minSeats >= seatMinMap[index]) {
      bestIndex = index;
      break;
    }
  }

  return bestIndex;
};

const createDefaultFilters = () => ({
  transmission: "both",
  vehicleType: "car",
  minPrice: null,
  maxPrice: null,
  seats: getDefaultSeatIndex(),
  sortBy: "recommended",
});

const isFiltersOpen = ref(false);
const filters = reactive(createDefaultFilters());

const seatsProgress = computed(
  () => `${(Number(filters.seats) || 0) * 33.33}%`,
);

const currentFilters = computed(() => {
  const seatIndex = Number(filters.seats) || 0;
  const minSeats = seatMinMap[seatIndex] ?? seatMinMap[0];

  return {
    sortBy: filters.sortBy,
    transmission: filters.transmission,
    vehicleType: filters.vehicleType,
    minSeats,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
});

// --- Машины с рассчитанной ценой ---
const carsWithTotal = computed(() =>
  cars.value.map((car) => {
    const pricing = getCarPricing(car, rentalDays.value);
    return {
      ...car,
      basePriceDay: pricing.basePriceDay,
      finalPriceDay: pricing.finalPriceDay,
      hasDiscount: pricing.hasDiscount,
      totalPrice: pricing.totalPrice,
    };
  }),
);

const pricePlaceholders = computed(() => {
  const filtersForPlaceholders = {
    ...currentFilters.value,
    minPrice: null,
    maxPrice: null,
  };

  const availableCars = applyFilters(
    carsWithTotal.value,
    filtersForPlaceholders,
  );

  if (!availableCars.length) {
    return { min: 0, max: 0 };
  }

  const totals = availableCars.map((car) => car.totalPrice);
  return {
    min: Math.min(...totals),
    max: Math.max(...totals),
  };
});

const filteredCars = computed(() =>
  applyFilters(carsWithTotal.value, currentFilters.value),
);

const resetFilters = () => {
  Object.assign(filters, createDefaultFilters());
};
</script>

<template>
  <main class="lg:container lg:mx-auto py-8">
    <!-- ПАНЕЛЬ ФИЛЬТРОВ -->
    <div
      v-if="filteredCars.length != 0"
      class="flex lg:hidden justify-end mb-4 px-4"
    >
      <UIBtn
        class="border-2 border-sec text-sec! transition-colors active:bg-sec/70 px-2"
        @click="isFiltersOpen = !isFiltersOpen"
      >
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="{ '-scale-y-100': isFiltersOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        {{ $t("booking.filters") }}
      </UIBtn>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 px-4 lg:px-0">
      <!-- САЙДБАР С ФИЛЬТРАМИ -->
      <aside
        :class="[
          'flex lg:flex-col flex-row md:items-start lg:items-stretch justify-start flex-wrap lg:w-75 w-full gap-8 lg:shrink-0 lg:border border-gray-200 rounded-lg lg:p-6 lg:h-fit sticky lg:top-24 bg-white transition-all duration-500 overflow-hidden',
          isFiltersOpen
            ? 'max-h-375 opacity-100 p-6 border mb-8 lg:mb-0'
            : 'max-h-0 opacity-0 p-0 border-0 lg:max-h-none lg:opacity-100 lg:p-6 lg:border',
        ]"
      >
        <div
          class="lg:flex justify-between items-center mb-6 md:order-3 order-2 lg:order-first ml-auto lg:ml-0 w-fit md:w-auto"
        >
          <h2 class="hidden lg:block text-xl font-bold">
            {{ $t("booking.filters") }}
          </h2>
          <UIBtn
            clear
            class="text-sec! font-semibold hover:underline px-4"
            @click="resetFilters"
          >
            {{ $t("booking.resetAll") }}
          </UIBtn>
        </div>

        <!-- Filter: Transmission -->
        <div class="w-1/2 md:w-1/3 lg:w-auto order-1">
          <h3 class="font-bold mb-4">{{ $t("booking.transmission") }}</h3>
          <div class="flex flex-col gap-3 text-gray-700 text-sm">
            <label
              v-for="option in transmissionOptions"
              :key="option.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <input
                v-model="filters.transmission"
                type="radio"
                name="transmission"
                :value="option.value"
                class="w-5 h-5 accent-sec"
              />
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Filter: Vehicle Type -->
        <div class="w-full md:w-1/3 lg:w-auto order-2">
          <h3 class="font-bold mb-4">{{ $t("booking.vehicleType") }}</h3>
          <div class="flex flex-col gap-3 text-gray-700 text-sm">
            <label
              v-for="option in typeOptions"
              :key="option.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <input
                v-model="filters.vehicleType"
                type="radio"
                name="v_type"
                :value="option.value"
                class="w-5 h-5 accent-sec"
              />
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Filter: Seats -->
        <div class="w-full md:w-1/2 lg:w-auto order-3">
          <h3 class="font-bold mb-4">{{ $t("booking.seats") }}</h3>
          <div class="relative w-full px-1 text-sm">
            <div
              class="flex justify-between text-xs font-bold text-gray-600 mb-2 relative z-10 pointer-events-none"
            >
              <span v-for="seat in seatMinMap" :key="seat"> {{ seat }}+ </span>
            </div>

            <div class="relative w-full h-1.5 flex items-center order-4">
              <div class="absolute inset-0 bg-sec rounded-lg" />
              <div
                class="absolute left-0 top-0 bottom-0 bg-gray-200 rounded-l-lg transition-all duration-150"
                :style="{ width: seatsProgress }"
              />

              <input
                v-model="filters.seats"
                type="range"
                min="0"
                max="3"
                step="1"
                class="w-full absolute inset-0 opacity-0 z-20 cursor-pointer appearance-none"
              />

              <div
                class="absolute w-4 h-4 bg-white border-2 border-sec rounded-full shadow z-10 pointer-events-none -mt-0.5 transition-all duration-150"
                :style="{ left: `calc(${seatsProgress} - 8px)` }"
              />
            </div>
          </div>
        </div>

        <!-- Filter: Price Range -->
        <div class="w-full md:w-1/2 lg:w-auto order-5">
          <h3 class="font-bold mb-4">{{ $t("booking.priceRange") }}</h3>
          <div class="flex gap-4 text-sm">
            <div
              class="flex flex-col border border-gray-300 rounded-md p-2 w-full focus-within:border-sec focus-within:ring-1 focus-within:ring-sec transition-all"
            >
              <label
                for="minPrice"
                class="text-xs text-gray-500 font-medium tracking-wide text-nowrap cursor-pointer"
              >
                {{ $t("order.minPrice") }}
              </label>
              <div class="flex items-center font-bold">
                <span class="mr-1 text-gray-700">€</span>
                <input
                  id="minPrice"
                  v-model="filters.minPrice"
                  type="number"
                  min="0"
                  :placeholder="pricePlaceholders.min"
                  class="w-full outline-none bg-transparent appearance-none"
                />
              </div>
            </div>

            <div
              class="flex flex-col border border-gray-300 rounded-md p-2 w-full focus-within:border-sec focus-within:ring-1 focus-within:ring-sec transition-all"
            >
              <label
                for="maxPrice"
                class="text-xs text-gray-500 font-medium tracking-wide text-nowrap cursor-pointer"
              >
                {{ $t("order.maxPrice") }}
              </label>
              <div class="flex items-center font-bold">
                <span class="mr-1 text-gray-700">€</span>
                <input
                  id="maxPrice"
                  v-model="filters.maxPrice"
                  type="number"
                  min="0"
                  :placeholder="pricePlaceholders.max"
                  class="w-full outline-none bg-transparent appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- СПИСОК КАРТОЧЕК АВТОМОБИЛЕЙ -->
      <h1 v-if="filteredCars.length != 0">{{ $t("booking.h1") }}</h1>

      <div class="flex-1 flex flex-col gap-4">
        <!-- Панель сортировки -->
        <div
          class="hidden lg:flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <span class="font-bold text-gray-700">
            {{ filteredCars.length }} {{ $t("booking.carsAvailable") }}
          </span>

          <div class="flex items-center gap-3 w-auto">
            <span class="text-sm font-bold text-gray-500 text-nowrap">
              {{ $t("booking.sortBy") }}
            </span>
            <UISelect
              id="sortSelect"
              v-model="filters.sortBy"
              :options="sortOptions"
              class="text-sm font-bold text-gray-700"
            />
          </div>
        </div>

        <div
          v-if="!filteredCars.length"
          class="text-center py-12 text-xl font-bold text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
        >
          {{ $t("booking.sorryVehicle") }}
        </div>

        <!-- Карточка -->
        <div
          v-for="car in filteredCars"
          v-else
          :key="car.id"
          class="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 md:gap-y-0 pb-6 border-b border-gray-200"
        >
          <!-- Изображение / Слайдер -->
          <div
            class="flex items-center justify-center -mx-4 md:mx-0 md:col-span-4 col-span-full relative h-72"
          >
            <ClientOnly v-if="activeSliderId === car.id && car.images?.length">
              <div class="relative w-full h-full">
                <Swiper
                  :modules="[Pagination]"
                  :pagination="{ clickable: true }"
                  :loop="true"
                  :grab-cursor="true"
                  style="
                    --swiper-pagination-bullet-width: 14px;
                    --swiper-pagination-bullet-height: 14px;
                  "
                  class="w-full h-full rounded-lg"
                  @click="(swiperInstance) => swiperInstance.slideNext()"
                >
                  <SwiperSlide v-for="(img, idx) in car.images" :key="idx">
                    <img
                      :src="getImageUrl(img)"
                      :alt="`${car.name} photo ${idx + 1}`"
                      class="w-full h-full object-contain mix-blend-multiply select-none"
                    />
                  </SwiperSlide>
                </Swiper>

                <UIBtn
                  sec
                  class="absolute! top-3 right-3 z-20 bg-black/60 text-white text-xs font-bold px-3 py-2 rounded-bl-none! hover:bg-black/75 transition-colors"
                  @click.stop="openFullscreenSlider(car)"
                >
                  {{ $t("booking.fullScreen") }}
                </UIBtn>
              </div>
            </ClientOnly>

            <div
              v-else
              class="w-full h-full flex items-center justify-center"
              :class="{ 'cursor-pointer group relative': car.images?.length }"
              @click="activateSlider(car)"
            >
              <img
                v-if="getImageUrl(car.img)"
                :src="getImageUrl(car.img || car.images?.[0] || null)"
                :alt="car.name"
                class="h-auto max-h-72 max-w-full object-contain mix-blend-multiply transition-transform duration-300"
                :class="{ 'group-hover:scale-105': car.images?.length }"
              />
              <UISvg v-else :svg="ICON_CAR_PLACEHOLDER" class="max-h-72" />

              <div
                v-if="car.images?.length"
                class="absolute bottom-2 right-2 bg-sec/60 text-white text-xs px-2 py-1 rounded-md transition-opacity flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ car.images.length }} {{ $t("booking.photos") }}
              </div>
            </div>
          </div>

          <!-- Центральная часть: Детали -->
          <div class="flex flex-col justify-start md:col-span-5 col-span-full">
            <h3 class="text-xl font-extrabold uppercase mb-2">
              {{ car.name }}
            </h3>

            <div class="mb-4">
              <span
                class="relative group inline-flex items-center gap-2 border border-gray-300 text-xs! font-bold px-3 py-1 rounded-full text-gray-700 uppercase tracking-wide cursor-help"
              >
                {{ $t("booking.orSimilar") }} {{ car.category.name }}
                <span
                  class="bg-gray-300 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                >
                  i
                </span>

                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-62.5 px-3 py-2 bg-gray-800 text-white text-xs font-normal normal-case text-center rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none shadow-lg"
                >
                  {{ $t("booking.receiveModel") }}
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-800"
                  />
                </div>
              </span>
            </div>

            <!-- Иконки характеристик -->
            <PartCarFeatures :car="car" class="mb-4" />

            <!-- Список преимуществ (скрыт на мобильном) -->
            <ul
              class="hidden md:flex flex-col gap-1.5 mb-4 text-gray-700 text-sm"
            >
              <li
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-center gap-2"
              >
                <svg
                  class="w-4 h-4 text-sec"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ benefit }}
              </li>
            </ul>
          </div>

          <!-- Правая часть: Цена и Кнопка -->
          <div
            class="flex flex-col md:justify-end md:items-end items-center text-right md:col-span-3 col-span-full"
          >
            <PartCarPrice :car="car" :days="rentalDays" />

            <UIBtn
              main
              class="font-extrabold transition-colors uppercase w-full"
              @click="handleSelectCar(car)"
            >
              {{ $t("common.select") }}
            </UIBtn>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen галерея -->

    <Teleport to="body">
      <div
        v-if="fullscreenCar"
        class="fixed inset-0 z-40 bg-black/95 flex items-center justify-center p-4"
        @click.self="closeFullscreenSlider"
      >
        <UIBtn
          type="button"
          class="absolute! top-[10vh] right-4 z-40 text-white border! border-white/20! hover:text-sec! rounded-md px-4 py-2 font-bold transition-colors"
          @click.stop="closeFullscreenSlider"
        >
          {{ t("common.close") }}
        </UIBtn>

        <div class="w-full max-w-7xl h-[80vh] relative">
          <Swiper
            :modules="[Pagination, Navigation, Keyboard]"
            :initial-slide="fullscreenStartIndex"
            :pagination="{ clickable: true }"
            :navigation="true"
            :keyboard="{ enabled: true }"
            :loop="true"
            class="w-full h-full"
            style="
              --swiper-theme-color: #ffffff;
              --swiper-pagination-bullet-width: 14px;
              --swiper-pagination-bullet-height: 14px;
            "
          >
            <SwiperSlide v-for="(img, idx) in fullscreenCar.images" :key="idx">
              <div
                class="w-full h-full flex items-center justify-center"
                @click.self="closeFullscreenSlider"
              >
                <img
                  :src="getImageUrl(img)"
                  :alt="`${fullscreenCar.name} photo ${idx + 1}`"
                  class="max-w-full max-h-full object-contain select-none"
                  @click.stop
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </Teleport>
  </main>
</template>
