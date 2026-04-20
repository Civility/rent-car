<script setup>
  import { subYears } from "date-fns";
  import { useVuelidate } from "@vuelidate/core";
  import { required, email, helpers } from "@vuelidate/validators";
  import { VueDatePicker } from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import { useRouter } from "vue-router";
  import { useBookingStore } from "@/store/booking";

  // getImageUrl подтянется через автоимпорт composable.
  const { submitOrder, $reset, fetchLocations } = useBookingStore();
  const { searchForm, locations, isLoading, orderError } =
    storeToRefs(useBookingStore());
  const router = useRouter();

  onMounted(async () => {
    if (
      searchForm.value.auto === null ||
      searchForm.value.dateFrom === null ||
      searchForm.value.dateTo === null
    ) {
      router.push("/");
      return;
    }
    if (!locations.value.length) {
      await fetchLocations();
    }
  });
  const maxDobDate = computed(() => {
    const requiredAge = searchForm.value.auto?.features?.age || 23;
    return subYears(new Date(), requiredAge);
  });

  const formatPrice = (value) => Number(value ?? 0).toFixed(2);

  const getBasePricePerDay = (car) => {
    return Number(car?.price?.priceDay ?? 0);
  };

  const getDiscountAmount = (car) => {
    return Number(car?.price?.discount ?? 0);
  };

  const getFinalPricePerDay = (car) => {
    return Math.max(getBasePricePerDay(car) - getDiscountAmount(car), 0);
  };

  const hasDiscount = (car) => {
    return (
      getDiscountAmount(car) > 0 &&
      getFinalPricePerDay(car) < getBasePricePerDay(car)
    );
  };

  const getLocationLabel = (code) => {
    const location = locations.value.find((item) => item.value === code);
    return location?.label || code || "Not selected";
  };

  const formatDateValue = (value) => {
    if (!value) return "Not selected";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTimeValue = (time) => {
    if (
      !time ||
      typeof time.hours !== "number" ||
      typeof time.minutes !== "number"
    ) {
      return "00:00";
    }

    return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
  };

  const rentalDays = computed(() => {
    if (!searchForm.value.dateFrom || !searchForm.value.dateTo) {
      return 1;
    }

    const start = new Date(searchForm.value.dateFrom);
    const end = new Date(searchForm.value.dateTo);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 1;
  });

  const selectedCarBasePrice = computed(() => {
    return getBasePricePerDay(searchForm.value.auto);
  });

  // const selectedCarDiscount = computed(() => {
  //   return getDiscountAmount(searchForm.value.auto);
  // });

  const selectedCarFinalPrice = computed(() => {
    return getFinalPricePerDay(searchForm.value.auto);
  });

  const selectedCarHasDiscount = computed(() => {
    return hasDiscount(searchForm.value.auto);
  });

  const selectedCarTotal = computed(() => {
    return selectedCarFinalPrice.value * rentalDays.value;
  });

  const pickupLocationLabel = computed(() => {
    return getLocationLabel(searchForm.value.location);
  });

  const dropoffLocationLabel = computed(() => {
    const code = searchForm.value.differentLocation
      ? searchForm.value.location
      : searchForm.value.returnLocation;

    return getLocationLabel(code);
  });

  // --- Ловушки на спам (натуральный анти-бот) ---
  const startTime = ref(0);
  const trapFieldName = ref("website_url");
  const trapValue = ref("");

  onMounted(() => {
    startTime.value = Date.now();
    const prefixes = ["website", "company", "url", "fax"];
    trapFieldName.value =
      prefixes[Math.floor(Math.random() * prefixes.length)] +
      "_" +
      Math.random().toString(36).substr(2, 4);
  });

  // Данные формы
  const form = reactive({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    privacyPolicy: false,
    // Спам чекбокс
    isConsent: false,
  });

  // Правила валидации
  const rules = {
    firstName: {
      required: helpers.withMessage("Enter your first name", required),
    },
    lastName: {
      required: helpers.withMessage("Enter your last name", required),
    },
    dateOfBirth: {
      required: helpers.withMessage("Select your date of birth", required),
    },
    email: {
      required: helpers.withMessage("Enter your email", required),
      email: helpers.withMessage("Invalid email format", email),
    },
    phone: {
      required: helpers.withMessage("Enter your phone number", required),
    },
    privacyPolicy: {
      required: helpers.withMessage(
        "You must accept the Privacy Policy",
        (value) => value === true,
      ),
    },
  };

  const v$ = useVuelidate(rules, form, { $autoDirty: true });

  const isFormDisabled = computed(() => v$.value.$error || !form.privacyPolicy);

  const handleSubmit = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    const timeElapsed = Date.now() - startTime.value;
    if (timeElapsed < 2500 || form.isConsent || trapValue.value !== "") {
      console.log("Spam detected. Blocked silently.");
      return;
    }

    const result = await submitOrder(form);

    if (!result.success) return;

    isSuccessModalOpen.value = true;

    successRedirectTimeout = setTimeout(async () => {
      await handleSuccessModalClose();
    }, 3500);
  };
  const isSuccessModalOpen = ref(false);
  let successRedirectTimeout = null;

  const handleSuccessModalClose = async () => {
    isSuccessModalOpen.value = false;

    if (successRedirectTimeout) {
      clearTimeout(successRedirectTimeout);
      successRedirectTimeout = null;
    }

    $reset();
    await router.push("/");
  };
  onBeforeUnmount(() => {
    if (successRedirectTimeout) {
      clearTimeout(successRedirectTimeout);
    }
  });
</script>

<template>
  <main class="lg:container lg:mx-auto py-8 md:px-0 px-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- ЛЕВАЯ ЧАСТЬ: Форма детали водителя -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <h1 class="text-3xl font-extrabold mb-2">Driver details</h1>

        <form
          class="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6"
          @submit.prevent="handleSubmit">
          <!-- Hiding Spam Traps -->
          <div
            class="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden"
            aria-hidden="true">
            <label>
              <span>consent to data processing</span>
              <input
                id="trap-consent"
                v-model="form.isConsent"
                name="trap-consent"
                type="checkbox"
                tabindex="-1" />
            </label>

            <label>
              <span>Leave empty if human</span>
              <input
                id="website_url"
                v-model="trapValue"
                type="text"
                name="website_url"
                tabindex="-1"
                autocomplete="off" />
              <!-- Исправлено на валидный "off" -->
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="relative">
              <label class="block cursor-pointer">
                <span class="block text-sm font-bold mb-2 text-zinc-900"
                  >First name*</span
                >
                <input
                  v-model="form.firstName"
                  name="firstName"
                  autocomplete="given-name"
                  type="text"
                  :class="[
                    'w-full border rounded-xl h-10 px-3 outline-none focus:border-sec transition-colors',
                    v$.firstName.$error ? 'border-red-400' : 'border-gray-300',
                  ]"
                  placeholder="e.g. John" />
              </label>
              <p
                v-if="v$.firstName.$error"
                class="text-red-600 text-xs font-bold absolute -bottom-4 left-0">
                {{ v$.firstName.$errors[0].$message }}
              </p>
            </div>

            <!-- Last Name -->
            <div class="relative">
              <label class="block cursor-pointer">
                <span class="block text-sm font-bold mb-2 text-zinc-900"
                  >Last name*</span
                >
                <input
                  v-model="form.lastName"
                  name="lastName"
                  autocomplete="family-name"
                  type="text"
                  :class="[
                    'w-full border rounded-xl h-10 px-3 outline-none focus:border-sec transition-colors',
                    v$.lastName.$error ? 'border-red-400' : 'border-gray-300',
                  ]"
                  placeholder="e.g. Doe" />
              </label>
              <p
                v-if="v$.lastName.$error"
                class="text-red-600 text-xs font-bold absolute -bottom-4 left-0">
                {{ v$.lastName.$errors[0].$message }}
              </p>
            </div>

            <!-- Date of Birth -->
            <div class="relative">
              <div class="block cursor-pointer relative z-10">
                <span class="block text-sm font-bold mb-2 text-zinc-900"
                  >Date of birth*</span
                >
                <ClientOnly>
                  <VueDatePicker
                    v-model="form.dateOfBirth"
                    :max-date="maxDobDate"
                    :start-date="maxDobDate"
                    :time-config="{ enableTimePicker: false }"
                    :enable-time-picker="false"
                    placeholder="Select Date"
                    auto-apply
                    :input-attrs="{
                      name: 'dateOfBirth',
                      autocomplete: 'bday',
                      id: 'dateOfBirth',
                    }"
                    :ui="{
                      input: [
                        'rounded-xl! h-10 w-full cursor-pointer',
                        v$.dateOfBirth.$error ? '!border-red-400' : '',
                      ],
                    }" />
                </ClientOnly>
              </div>
              <p
                v-if="v$.dateOfBirth.$error"
                class="text-red-600 text-xs font-bold absolute -bottom-4 left-0">
                {{ v$.dateOfBirth.$errors[0].$message }}
              </p>
            </div>

            <!-- Email -->
            <div class="relative">
              <label class="block cursor-pointer">
                <span class="block text-sm font-bold mb-2 text-zinc-900"
                  >Email*</span
                >
                <input
                  v-model="form.email"
                  name="email"
                  autocomplete="email"
                  type="email"
                  :class="[
                    'w-full border rounded-xl h-10 px-3 outline-none focus:border-sec transition-colors',
                    v$.email.$error ? 'border-red-400' : 'border-gray-300',
                  ]"
                  placeholder="email@example.com" />
              </label>
              <p
                v-if="v$.email.$error"
                class="text-red-600 text-xs font-bold absolute -bottom-4 left-0">
                {{ v$.email.$errors[0].$message }}
              </p>
            </div>

            <!-- Phone Number -->
            <div class="relative md:col-span-2">
              <label class="block cursor-pointer">
                <span class="block text-sm font-bold mb-2 text-zinc-900"
                  >Phone number*</span
                >
                <input
                  v-model="form.phone"
                  name="phone"
                  autocomplete="tel"
                  type="tel"
                  :class="[
                    'w-full border rounded-xl h-10 px-3 outline-none focus:border-sec transition-colors',
                    v$.phone.$error ? 'border-red-400' : 'border-gray-300',
                  ]"
                  placeholder="+30 690 000 0000" />
              </label>
              <p
                v-if="v$.phone.$error"
                class="text-red-600 text-xs font-bold absolute -bottom-4 left-0">
                {{ v$.phone.$errors[0].$message }}
              </p>
            </div>
          </div>

          <hr class="border-gray-200" />

          <!-- Privacy Policy Checkbox -->
          <div class="relative">
            <label class="flex items-start gap-3 cursor-pointer py-1">
              <input
                v-model="form.privacyPolicy"
                name="privacyPolicy"
                type="checkbox"
                class="mt-1 w-5 h-5 accent-sec shrink-0" />
              <span class="text-sm font-medium text-gray-700">
                I have read, understood and I accept the
                <a
                  href="/privacy-policy.pdf"
                  class="text-sec font-bold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read our Privacy Policy (opens in a new tab)"
                  @click.stop>
                  Privacy Policy </a
                >.
              </span>
            </label>
            <p
              v-if="v$.privacyPolicy.$error && v$.privacyPolicy.$dirty"
              class="text-red-600 text-xs font-bold">
              {{ v$.privacyPolicy.$errors[0].$message }}
            </p>
          </div>
          <div
            v-if="orderError"
            class="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-200">
            {{ orderError }}
          </div>
          <!-- Submit Button (Next step) -->
          <div class="pt-4">
            <UIBtn
              type="submit"
              main
              class="px-8 font-extrabold uppercase py-3! w-full md:w-auto"
              :class="{
                'opacity-50 bg-zinc-500! cursor-not-allowed':
                  isFormDisabled || isLoading,
              }"
              :disabled="isFormDisabled || isLoading || isSuccessModalOpen">
              <span v-if="isLoading">Processing...</span>
              <span v-else>Order a car</span>
            </UIBtn>
          </div>
        </form>
      </div>

      <!-- ПРАВАЯ ЧАСТЬ: Выбранные данные -->
      <aside class="lg:col-span-1">
        <div
          class="sticky top-24 bg-white p-6 lg:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <h2 class="text-xl font-bold border-b border-gray-100 pb-4">
            Your Selection
          </h2>

          <div
            v-if="searchForm.auto"
            class="flex flex-col gap-4">
            <!-- Картинка выбранной машины -->
            <div class="h-40 w-full flex items-center justify-center">
              <img
                :src="
                  searchForm.auto.img
                    ? getImageUrl(searchForm.auto.img)
                    : searchForm.auto.images?.[0]
                      ? getImageUrl(searchForm.auto.images[0])
                      : '/car-placeholder.png'
                "
                :alt="searchForm.auto.name"
                class="max-h-full max-w-full object-contain mix-blend-multiply" />
            </div>

            <!-- Название и Категория -->
            <div class="text-center pb-4 border-b border-gray-100">
              <span
                class="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {{ searchForm.auto.category.name }}
              </span>
              <h3 class="text-xl font-black text-gray-900 mt-1 uppercase">
                {{ searchForm.auto.name }}
              </h3>
            </div>

            <!-- Иконки характеристик -->
            <div
              class="grid grid-cols-3 gap-y-4 gap-x-2 text-sm font-bold text-gray-700 py-2">
              <div
                class="flex items-center gap-1.5 justify-center"
                title="seats">
                👥
                <span class="text-xs">{{
                  searchForm.auto.features.seats
                }}</span>
              </div>
              <div
                class="flex items-center gap-1.5 justify-center"
                title="Doors">
                🚪
                <span class="text-xs">{{
                  searchForm.auto.features.doors
                }}</span>
              </div>
              <div
                class="flex items-center gap-1.5 justify-center"
                title="Bags">
                🧳
                <span class="text-xs">{{ searchForm.auto.features.bags }}</span>
              </div>
              <div
                class="flex items-center gap-1.5 justify-center"
                title="Transmission">
                ⚙️
                <span class="text-xs">
                  {{
                    searchForm.auto.features.transmission === "A"
                      ? "Auto"
                      : "Manual"
                  }}
                </span>
              </div>
              <div
                v-if="searchForm.auto.features.ac"
                class="flex items-center gap-1.5 justify-center"
                title="Air Conditioning">
                ❄️ <span class="text-xs">A/C</span>
              </div>
              <div
                class="flex items-center gap-1.5 justify-center"
                title="Minimum Age">
                🆔
                <span class="text-xs">{{ searchForm.auto.features.age }}+</span>
              </div>
            </div>

            <!-- Данные бронирования -->
            <div
              class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
              <div class="flex justify-between gap-4 text-sm">
                <span class="font-bold text-gray-500 uppercase">Pick-up</span>
                <span class="text-right font-semibold text-gray-800">
                  {{ pickupLocationLabel }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="font-bold text-gray-500 uppercase">Drop-off</span>
                <span class="text-right font-semibold text-gray-800">
                  {{ dropoffLocationLabel }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="font-bold text-gray-500 uppercase">From</span>
                <span class="text-right font-semibold text-gray-800">
                  {{ formatDateValue(searchForm.dateFrom) }}
                  {{ formatTimeValue(searchForm.timeFrom) }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="font-bold text-gray-500 uppercase">To</span>
                <span class="text-right font-semibold text-gray-800">
                  {{ formatDateValue(searchForm.dateTo) }}
                  {{ formatTimeValue(searchForm.timeTo) }}
                </span>
              </div>

              <div
                class="flex justify-between gap-4 text-sm pt-3 border-t border-gray-200">
                <span class="font-bold text-gray-500 uppercase"
                  >Rental period</span
                >
                <span class="text-right font-semibold text-gray-800">
                  {{ rentalDays }} day<span v-if="rentalDays > 1">s</span>
                </span>
              </div>
            </div>

            <!-- Цена -->
            <div class="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-bold text-gray-500 uppercase">
                  Price per day
                </span>

                <div class="text-right">
                  <div
                    v-if="selectedCarHasDiscount"
                    class="text-sm text-gray-400 line-through decoration-red-500 decoration-2">
                    € {{ formatPrice(selectedCarBasePrice) }}
                  </div>

                  <div class="font-bold text-gray-700">
                    € {{ formatPrice(selectedCarFinalPrice) }}
                  </div>
                </div>
              </div>

              <!-- <div
                v-if="selectedCarHasDiscount"
                class="flex justify-between items-center mb-1"
              >
                <span class="text-sm font-bold text-gray-500 uppercase">
                  Car discount
                </span>
                <span class="font-bold text-green-600">
                  - € {{ formatPrice(selectedCarDiscount) }}
                </span>
              </div> -->

              <!-- <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-bold text-gray-500 uppercase">
                  Rental days
                </span>
                <span class="font-bold text-gray-700">
                  {{ rentalDays }}
                </span>
              </div> -->

              <div
                class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span
                  class="text-lg font-black bg-linear-to-t from-dark to-sec bg-clip-text text-transparent uppercase tracking-wide">
                  Total
                </span>

                <div class="text-right">
                  <div class="text-2xl font-black">
                    € {{ formatPrice(selectedCarTotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="py-12 bg-gray-50 flex items-center justify-center text-center text-sm text-gray-400 font-bold rounded-xl border border-dashed border-gray-300">
            [ No car selected ]
          </div>
        </div>
      </aside>
    </div>
    <UIModal
      v-model="isSuccessModalOpen"
      type="success"
      title="Your request has been sent successfully."
      message="If the manager has any questions, they will call you back shortly to clarify the trip details."
      button-text="Back to home"
      @close="handleSuccessModalClose"
      @confirm="handleSuccessModalClose">
      <template #note>
        Our manager will review your booking and contact you shortly if any
        details need clarification.
      </template>
    </UIModal>
  </main>
</template>
