<script setup>
  import ICON_CAR_PLACEHOLDER from "@/assets/icons/car-placeholder.svg";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Pagination } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";
  import { storeToRefs } from "pinia";
  import { useBookingStore } from "@/store/booking";
  import { useRouter } from "vue-router";
  const { searchForm } = storeToRefs(useBookingStore());
  const { setSearchForm } = useBookingStore();
  const router = useRouter();

  const handleSelectCar = (car) => {
    // Сохраняем всю машину (или хотя бы ID и age) в поле auto
    setSearchForm({ auto: car });
    router.push("/booking/review");
  };
  onMounted(() => {
    if (
      searchForm.value.dateFrom === null ||
      searchForm.value.dateTo === null
    ) {
      router.push("/");
    }
  });
  const cars = [
    {
      id: 1,
      name: "TOYOTA COROLLA 1.2",
      category: "COMPACT",
      type: "car",
      image: "/images/car1.webp",
      images: ["/images/car1.webp", "/images/car2.webp", "/images/car3.webp"],
      features: {
        passengers: 5,
        doors: 5,
        bags: 3,
        transmission: "A",
        ac: true,
        age: 23,
      },
      priceDay: 32.12,
    },
    {
      id: 2,
      name: "TOYOTA COROLLA 1.4",
      category: "COMPACT",
      type: "car",
      image: "/images/car2.webp",
      features: {
        passengers: 5,
        doors: 5,
        bags: 3,
        transmission: "A",
        ac: true,
        age: 21,
      },
      priceDay: 15.98,
    },
    {
      id: 3,
      name: "NISSAN QASHQAI 1.3",
      category: "INTERMEDIATE",
      type: "premium",
      image: "/images/car3.webp",
      features: {
        passengers: 5,
        doors: 5,
        bags: 3,
        transmission: "M",
        ac: true,
        age: 23,
      },
      priceDay: 30.93,
    },
  ];

  const sortOptions = [
    { label: "Recommended", value: "recommended" },
    { label: "Lower price", value: "price_asc" },
    { label: "Higher price", value: "price_desc" },
  ];
  const benefits = [
    "Unlimited mileage",
    "Basic protection included",
    "Free cancellation up to 48h before pick up",
  ];
  const transmissionOptions = [
    { label: "Automatic", value: "A" },
    { label: "Manual", value: "M" },
    { label: "Both", value: "both" },
  ];
  const vehicleTypeOptions = [
    { label: "Car", value: "car" },
    { label: "Vans & Trucks", value: "vans" },
    { label: "Premium", value: "premium" },
  ];
  // состояние для отслеживания, какой слайдер сейчас открыт
  const activeSliderId = ref(null);
  const activateSlider = (car) => {
    if (car.images && car.images.length > 0) {
      activeSliderId.value = car.id;
    }
  };
  // Массив количества мест (также нужен в template для шапки слайдера)
  const seatMinMap = [2, 4, 5, 7];
  // Функция для нахождения минимального индекса мест среди всех доступных авто
  const getDefaultSeatIndex = () => {
    if (!cars.length) return 0;
    // Находим авто с наименьшим числом мест
    const minPassengers = Math.min(...cars.map((c) => c.features.passengers));

    // Ищем подходящий индекс в seatMinMap (например, для 5 вернет индекс 2)
    let bestIndex = 0;
    for (let i = seatMinMap.length - 1; i >= 0; i--) {
      if (minPassengers >= seatMinMap[i]) {
        bestIndex = i;
        break;
      }
    }
    return bestIndex;
  };
  const defaultFilters = {
    transmission: "both",
    vehicleType: "car",
    minPrice: null,
    maxPrice: null,
    seats: 0,
    seats: getDefaultSeatIndex(),
    sortBy: "recommended",
  };

  const isFiltersOpen = ref(false);
  const filters = reactive({ ...defaultFilters });

  const seatsProgress = computed(() => {
    return `${filters.seats * 33.33}%`;
  });

  const { calculateTotal } = usePriceCalculator();
  const rentalDays = ref(10);
  // --- ВЫЧИСЛЕНИЕ ДИНАМИЧЕСКИХ ПЛЕЙСХОЛДЕРОВ ДЛЯ TOTAL ---
  const minTotalPlaceholder = computed(() => {
    if (!cars.length) return 0;
    const totals = cars.map((car) =>
      Number(calculateTotal(car.priceDay, rentalDays.value)),
    );
    return Math.min(...totals);
  });

  const maxTotalPlaceholder = computed(() => {
    if (!cars.length) return 0;
    const totals = cars.map((car) =>
      Number(calculateTotal(car.priceDay, rentalDays.value)),
    );
    return Math.max(...totals);
  });
  const currentFilters = computed(() => {
    const seatMinMap = [2, 4, 5, 7];
    const minSeats = seatMinMap[filters.seats];

    return {
      sortBy: filters.sortBy,
      transmission: filters.transmission,
      vehicleType: filters.vehicleType,
      minSeats,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };
  });
  const carsWithTotal = computed(() => {
    return cars.map((car) => ({
      ...car,
      totalPrice: Number(calculateTotal(car.priceDay, rentalDays.value)),
    }));
  });
  const pricePlaceholders = computed(() => {
    // Копия фильтров без учета введенных пользователем цен
    const filtersForPlaceholders = {
      ...currentFilters.value,
      minPrice: null,
      maxPrice: null,
    };

    // Получаем список машин, которые соответствуют остальным критериям
    const availableCars = applyFilters(
      carsWithTotal.value,
      filtersForPlaceholders,
    );

    if (!availableCars.length) return { min: 0, max: 0 };

    // Ищем минимум и максимум среди доступных
    const totals = availableCars.map((car) => car.totalPrice);
    return {
      min: Math.min(...totals),
      max: Math.max(...totals),
    };
  });
  const filteredCars = computed(() => {
    return applyFilters(carsWithTotal.value, currentFilters.value);
  });

  const resetFilters = () => {
    Object.assign(filters, defaultFilters);
  };
</script>

<template>
  <main class="lg:container lg:mx-auto py-8">
    <!-- ПАНЕЛЬ ФИЛЬТРОВ -->
    <div class="flex lg:hidden justify-end mb-4 px-4">
      <UIBtn
        @click="isFiltersOpen = !isFiltersOpen"
        class="border-2! border-sec! text-sec! transition-colors active:bg-sec/70 px-2">
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="{ '-scale-y-100': isFiltersOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
        Filters
      </UIBtn>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 px-4 lg:px-0">
      <!-- САЙДБАР С ФИЛЬТРАМИ  -->
      <aside
        :class="[
          'flex lg:flex-col flex-row  md:items-start lg:items-stretch justify-start flex-wrap lg:w-75 w-full gap-8 lg:shrink-0 lg:border border-gray-200 rounded-lg lg:p-6 lg:h-fit sticky lg:top-24 bg-white transition-all duration-500 overflow-hidden',
          isFiltersOpen
            ? 'max-h-375 opacity-100 p-6 border mb-8 lg:mb-0'
            : 'max-h-0 opacity-0 p-0 border-0 lg:max-h-none lg:opacity-100 lg:p-6 lg:border',
        ]">
        <div
          class="lg:flex justify-between items-center mb-6 md:order-3 order-2 lg:order-first ml-auto lg:ml-0 w-fit md:w-auto">
          <h2 class="hidden lg:block text-xl font-bold">Filters</h2>
          <UIBtn
            clear
            @click="resetFilters"
            class="text-sec! font-semibold hover:underline px-4">
            Reset all
          </UIBtn>
        </div>

        <!-- Filter: Transmission -->
        <!-- <div class="mb-8 md:mb-0">-->
        <div class="w-1/2 md:w-1/3 lg:w-auto order-1">
          <h3 class="font-bold mb-4">Transmission</h3>
          <div class="flex flex-col gap-3 text-gray-700 text-sm">
            <label
              v-for="option in transmissionOptions"
              :key="option.value"
              class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="transmission"
                :value="option.value"
                v-model="filters.transmission"
                class="w-5 h-5 accent-sec" />
              {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Filter: Vehicle Type -->
        <div class="w-full md:w-1/3 lg:w-auto order-2">
          <h3 class="font-bold mb-4">Vehicle type</h3>
          <div class="flex flex-col gap-3 text-gray-700 text-sm">
            <label
              v-for="option in vehicleTypeOptions"
              :key="option.value"
              class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="v_type"
                :value="option.value"
                v-model="filters.vehicleType"
                class="w-5 h-5 accent-sec" />
              {{ option.label }}
            </label>
          </div>
        </div>
        <!-- Filter: Seats -->
        <div class="w-full md:w-1/2 lg:w-auto order-3">
          <h3 class="font-bold mb-4">Seats</h3>
          <div class="relative w-full px-1 text-sm">
            <div
              class="flex justify-between text-xs font-bold text-gray-600 mb-2 relative z-10 pointer-events-none">
              <!-- Добавлен :key="seat" -->
              <span
                v-for="seat in seatMinMap"
                :key="seat">
                {{ seat }}+
              </span>
            </div>

            <div class="relative w-full h-1.5 flex items-center order-4">
              <div class="absolute inset-0 bg-sec rounded-lg"></div>
              <div
                class="absolute left-0 top-0 bottom-0 bg-gray-200 rounded-l-lg transition-all duration-150"
                :style="{ width: seatsProgress }"></div>

              <input
                type="range"
                min="0"
                max="3"
                step="1"
                v-model="filters.seats"
                class="w-full absolute inset-0 opacity-0 z-20 cursor-pointer appearance-none" />

              <div
                class="absolute w-4 h-4 bg-white border-2 border-sec rounded-full shadow z-10 pointer-events-none -mt-0.5 transition-all duration-150"
                :style="{ left: `calc(${seatsProgress} - 8px)` }"></div>
            </div>
          </div>
        </div>
        <!-- Filter: Price Range -->
        <div class="w-full md:w-1/2 lg:w-auto order-5">
          <h3 class="font-bold mb-4">Price range</h3>
          <div class="flex gap-4 text-sm">
            <!-- Min Price Input -->
            <div
              class="flex flex-col border border-gray-300 rounded-md p-2 w-full focus-within:border-sec focus-within:ring-1 focus-within:ring-sec transition-all">
              <label
                for="minPrice"
                class="text-xs text-gray-500 font-medium tracking-wide text-nowrap cursor-pointer">
                min price
              </label>
              <div class="flex items-center font-bold">
                <span class="mr-1 text-gray-700">€</span>
                <input
                  id="minPrice"
                  type="number"
                  min="0"
                  v-model="filters.minPrice"
                  :placeholder="pricePlaceholders.min"
                  class="w-full outline-none bg-transparent appearance-none" />
              </div>
            </div>

            <!-- Max Price Input -->
            <div
              class="flex flex-col border border-gray-300 rounded-md p-2 w-full focus-within:border-sec focus-within:ring-1 focus-within:ring-sec transition-all">
              <label
                for="maxPrice"
                class="text-xs text-gray-500 font-medium tracking-wide text-nowrap cursor-pointer">
                max price
              </label>
              <div class="flex items-center font-bold">
                <span class="mr-1 text-gray-700">€</span>
                <input
                  id="maxPrice"
                  type="number"
                  min="0"
                  v-model="filters.maxPrice"
                  :placeholder="pricePlaceholders.max"
                  class="w-full outline-none bg-transparent appearance-none" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- СПИСОК КАРТОЧЕК АВТОМОБИЛЕЙ -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- Панель сортировки (Верхняя часть контента) -->
        <div
          class="hidden lg:flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
          <span class="font-bold text-gray-700"
            >{{ filteredCars.length }} cars available</span
          >

          <div class="flex items-center gap-3">
            <span class="text-sm font-bold text-gray-500">Sort by</span>
            <UISelect
              id="sortSelect"
              v-model="filters.sortBy"
              :options="sortOptions"
              class="w-48 text-sm font-bold text-gray-700" />
          </div>
        </div>
        <div
          v-if="!filteredCars.length"
          class="text-center py-12 text-xl font-bold text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          Sorry, there’s no vehicle.
        </div>
        <!-- Карточка (Grid Версия) -->
        <div
          v-else
          v-for="car in filteredCars"
          :key="car.id"
          class="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 md:gap-y-0 pb-6 border-b border-gray-200">
          <!-- Левая часть: Изображение -->
          <!-- Левая часть: Изображение или Слайдер -->
          <div
            class="flex items-center justify-center -mx-4 md:mx-0 md:col-span-4 col-span-full relative h-72">
            <!-- Если слайдер активен и есть изображения -->
            <ClientOnly v-if="activeSliderId === car.id && car.images?.length">
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
                @click="(swiperInstance) => swiperInstance.slideNext()">
                <SwiperSlide
                  v-for="(img, idx) in car.images"
                  :key="idx">
                  <img
                    :src="img"
                    :alt="`${car.name} photo ${idx + 1}`"
                    class="w-full h-full object-contain mix-blend-multiply select-none" />
                </SwiperSlide>
              </Swiper>
            </ClientOnly>

            <!-- Иначе показываем превью (до клика) -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
              :class="{ 'cursor-pointer group relative': car.images?.length }"
              @click="activateSlider(car)">
              <img
                v-if="car.image"
                :src="car.image"
                :alt="car.name"
                class="h-auto max-h-72 max-w-full object-contain mix-blend-multiply transition-transform duration-300"
                :class="{ 'group-hover:scale-105': car.images?.length }" />
              <UISvg
                v-else
                :svg="ICON_CAR_PLACEHOLDER"
                class="max-h-72" />

              <!-- Подсказка, что можно кликнуть (иконка галереи), показывается если есть доп. фото -->
              <div
                v-if="car.images?.length"
                class="absolute bottom-2 right-2 bg-sec/60 text-white text-xs px-2 py-1 rounded-md transition-opacity flex items-center gap-1">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ car.images.length }} photos
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
                class="relative group inline-flex items-center gap-2 border border-gray-300 text-xs! font-bold px-3 py-1 rounded-full text-gray-700 uppercase tracking-wide cursor-help">
                OR SIMILAR {{ car.category }}
                <span
                  class="bg-gray-300 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                  >i</span
                >

                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-62.5 px-3 py-2 bg-gray-800 text-white text-xs font-normal normal-case text-center rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none shadow-lg">
                  You'll receive this model or an equivalent vehicle for your
                  convenience.
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-800"></div>
                </div>
              </span>
            </div>

            <!-- Иконки характеристик -->
            <div
              class="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-700 mb-4">
              <!-- Passengers -->
              <div class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1"
                  >👥 {{ car.features.passengers }}</span
                >
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  Passengers
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <!-- Doors -->
              <div class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1"
                  >🚪 {{ car.features.doors }}</span
                >
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  Doors
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <!-- Bags -->
              <div class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1"
                  >🧳 {{ car.features.bags }}</span
                >
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  Bags
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <!-- Transmission -->
              <div class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1"
                  >⚙️ {{ car.features.transmission }}</span
                >
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  {{
                    car.features.transmission === "A" ? "Automatic" : "Manual"
                  }}
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <!-- A/C -->
              <div
                v-if="car.features.ac"
                class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1">❄️ A/C</span>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  Air Conditioning
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <!-- Age -->
              <div class="relative group flex items-center cursor-help">
                <span class="flex items-center gap-1"
                  >🆔 {{ car.features.age }}</span
                >
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                  Age
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>

            <!-- Список преимуществ (скрыт на мобильном) -->
            <ul
              class="hidden md:flex flex-col gap-1.5 mb-4 text-gray-700 text-sm">
              <li
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-sec"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
                {{ benefit }}
              </li>
            </ul>
          </div>

          <!-- Правая часть: Цена и Кнопка -->
          <!-- На Desktop: колонка справа. На Mobile: смещение влево или вправо по дизайну, тут мы ставим его вниз справа -->
          <div
            class="flex flex-col md:justify-end items-end text-right md:mt-0 -mt-10 md:col-span-3 col-span-full">
            <!-- Блок с ценой -->
            <div class="mb-4">
              <p
                class="text-xs font-bold tracking-wider uppercase mb-0.5 bg-linear-to-t from-dark to-sec bg-clip-text text-transparent w-fit">
                From
              </p>
              <p class="text-2xl font-black mb-1 leading-none">
                €{{ car.priceDay }}
                <span class="text-lg font-normal">/ day</span>
              </p>
              <p
                class="text-xs font-bold tracking-wider uppercase mb-0.5 bg-linear-to-t from-sec to-dark bg-clip-text text-transparent w-fit">
                TOTAL
                <strong
                  >€ {{ calculateTotal(car.priceDay, rentalDays) }}</strong
                >
              </p>
            </div>

            <UIBtn
              @click="handleSelectCar(car)"
              main
              class="font-extrabold transition-colors uppercase w-full">
              Select
            </UIBtn>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
