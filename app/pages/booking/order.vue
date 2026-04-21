<script setup>
  import { subYears } from "date-fns";
  import { useVuelidate } from "@vuelidate/core";
  import { required, email, helpers } from "@vuelidate/validators";
  import { VueDatePicker } from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { useBookingStore } from "@/store/booking";

  const router = useRouter();
  const bookingStore = useBookingStore();
  const { submitOrder, fetchLocations } = bookingStore;
  const { searchForm, locations, isLoading, orderError } =
    storeToRefs(bookingStore);

  // --- Composables ---
  const { formatDateValue, formatTimeValue, useRentalDays } = useBookingDates();
  const { pickupLocationLabel, dropoffLocationLabel } = useBookingLocations(
    locations,
    searchForm,
  );
  const rentalDays = useRentalDays(searchForm);

  const {
    isOpen: isSuccessModalOpen,
    open: openSuccessModal,
    close: handleSuccessModalClose,
  } = useSuccessRedirect({
    redirectTo: "/",
    delay: 3500,
    onBeforeRedirect: () => bookingStore.$reset(),
  });

  // --- Guard + подгрузка локаций ---
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

  // --- Минимальный возраст водителя для DatePicker ---
  const maxDobDate = computed(() => {
    const requiredAge = searchForm.value.auto?.features?.age || 23;
    return subYears(new Date(), requiredAge);
  });

  // --- Анти-спам: honeypot + тайминг ---
  const startTime = ref(0);
  const trapValue = ref("");

  onMounted(() => {
    startTime.value = Date.now();
  });

  // --- Форма водителя ---
  const form = reactive({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    privacyPolicy: false,
    isConsent: false,
  });

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

    openSuccessModal();
  };
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
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div class="relative">
              <label class="block cursor-pointer">
                <span class="block text-sm font-bold mb-2 text-zinc-900">
                  First name*
                </span>
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
                <span class="block text-sm font-bold mb-2 text-zinc-900">
                  Last name*
                </span>
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
                <span class="block text-sm font-bold mb-2 text-zinc-900">
                  Date of birth*
                </span>
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
                <span class="block text-sm font-bold mb-2 text-zinc-900">
                  Email*
                </span>
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
                <span class="block text-sm font-bold mb-2 text-zinc-900">
                  Phone number*
                </span>
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

          <!-- Submit Button -->
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
                {{ searchForm.auto.category?.name }}
              </span>
              <h3 class="text-xl font-black text-gray-900 mt-1 uppercase">
                {{ searchForm.auto.name }}
              </h3>
            </div>

            <!-- Иконки характеристик -->
            <PartCarFeatures
              :car="searchForm.auto"
              :columns="3"
              class="py-2" />

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
                <span class="font-bold text-gray-500 uppercase">
                  Rental period
                </span>
                <span class="text-right font-semibold text-gray-800">
                  {{ rentalDays }} day<span v-if="rentalDays > 1">s</span>
                </span>
              </div>
            </div>

            <!-- Цена -->
            <PartSummaryPrice
              :car="searchForm.auto"
              :days="rentalDays" />
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
