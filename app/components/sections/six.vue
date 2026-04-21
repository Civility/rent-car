<script setup>
import { useVuelidate } from "@vuelidate/core";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store/main";
import ICON_VIBER from "@/assets/icons/viber.svg";
import ICON_WHATSAPP from "@/assets/icons/whatsapp.svg";
import ICON_FACEBOOK from "@/assets/icons/facebook.svg";
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import { vMaska } from "maska/vue";

const { sendCallMeBack } = useMainStore();
const { lang } = storeToRefs(useMainStore());

const startTime = ref(0);

const trapValue = ref("");
onMounted(() => {
  startTime.value = Date.now();
});
const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
  isConsent: false,
});
const noLinksOrHtml = helpers.regex(/^(?!.*(<[^>]+>|https?:\/\/|www\.)).*/i);
const isSuccessModalOpen = ref(false);
const lettersOnly = helpers.regex(/^[\p{L}\s\-']+$/u);
const minTwoWords = (value) => {
  if (!value) return false;
  const words = value.trim().split(/\s+/);
  return words.length >= 2;
};
// Правила валидации
const rules = {
  name: {
    required: helpers.withMessage("Name is required", required),
    minLength: helpers.withMessage("Minimum 2 characters", minLength(2)),
    maxLength: helpers.withMessage("Maximum 32 characters", maxLength(32)),
    lettersOnly: helpers.withMessage(
      "Name must contain only letters",
      lettersOnly,
    ),
  },
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Invalid email address", email),
  },
  // Указываем минимальную длину с учетом маски, например: +1 (123) 456-7890 (длина 17)
  // Но вы можете адаптировать длину под свою страну
  phone: {
    required: helpers.withMessage("Phone is required", required),
    minLength: helpers.withMessage("Phone number is incomplete", minLength(17)),
  },
  message: {
    required: helpers.withMessage("Message is required", required),
    minLength: helpers.withMessage("Minimum 6 characters", minLength(6)),
    minTwoWords: helpers.withMessage(
      "Message must contain at least 2 words",
      minTwoWords,
    ),
    noLinksOrHtml: helpers.withMessage(
      "Links and HTML tags are not allowed",
      noLinksOrHtml,
    ),
  },
};

const v$ = useVuelidate(rules, form, { $autoDirty: true });
const errorMessage = ref("");
const resetForm = () => {
  form.value.name = "";
  form.value.email = "";
  form.value.phone = "";
  form.value.message = "";
  form.value.isConsent = false;
  trapValue.value = "";
  v$.value.$reset();
};

const handleSubmit = async () => {
  errorMessage.value = "";

  const isValid = await v$.value.$validate();
  if (!isValid) return;

  const timeElapsed = Date.now() - startTime.value;
  if (timeElapsed < 3000 || form.value.isConsent || trapValue.value !== "") {
    console.log("Spam detected. Blocked silently.");
    isSuccessModalOpen.value = true;
    resetForm();
    return;
  }

  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    message: form.value.message,
    locale: lang.value,
    started_at: startTime.value,
    is_consent: form.value.isConsent,
    website_url: trapValue.value,
  };

  const result = await sendCallMeBack(payload);

  if (result.success) {
    isSuccessModalOpen.value = true;
    resetForm();
  } else {
    errorMessage.value =
      result.error || "Failed to send your request. Please try again.";
  }
};
const handleSuccessModalClose = () => {
  isSuccessModalOpen.value = false;
};
</script>
<template>
  <section class="relative md:pt-30 pb-20 md:pb-30 lg:pb-50">
    <span class="absolute lg:-top-1/4 -top-30 left-auto -z-10">
      <img
        src="@/assets/webp/contacts-bg.webp"
        alt="contacts"
        class="object-cover w-full h-full"
      />
    </span>

    <div class="relative lg:container lg:mx-auto px-4">
      <div class="relative grid grid-cols-2">
        <div
          class="absolute -top-30 -left-[2%] w-60 h-60 flex items-center justify-center"
        >
          <!-- Левый лист (начинает двигаться из левой части) -->
          <img
            src="@/assets/webp/leaf-1.webp"
            alt="six-leaf"
            class="absolute -scale-x-100 z-10 left-0 top-10 w-16 h-16 object-contain rotate-45 animate-leaf-orbit"
          />

          <!-- Рука по центру (над логотипом) -->
          <img
            src="@/assets/webp/logo-hand.webp"
            alt="six-hand"
            class="hidden md:block absolute left-15 top-8.5 z-20 w-50 h-50 object-contain -mt-20"
          />

          <!-- Логотип по центру базы -->
          <PartLogo
            class="h-40 w-40 z-10 absolute -top-10 left-5 hidden md:flex"
            class1="h-40 w-40"
            class2="text-white! h-25 w-25"
            class3="text-white! h-25 w-25"
          />

          <!-- Правый лист (начинает двигаться из правой части) -->
          <img
            src="@/assets/webp/leaf-5.webp"
            alt="six-leaf-5"
            class="absolute z-10 -right-10 top-10 md:-top-10 w-24 h-24 object-contain animate-leaf-orbit-reverse"
          />
        </div>
        <div
          class="col-span-full lg:col-span-1 -mx-4 md:mx-0 py-7 px-5 rounded-t-4xl lg:rounded-r-none lg:rounded-l-4xl border-t-2 border-x-2 border-white bg-linear-to-r from-transparent to-white/90"
        >
          <h3 class="text-4xl mb-7">Call me back</h3>
          <p class="text-lg mb-7 leading-5">
            Leave your contact details. <br />
            Our managers will contact you shortly.
          </p>
          <ClientOnly>
            <form
              id="callMeBack"
              class="grid lg:grid-cols-3 grid-cols-1 gap-5 lg:gap-2.5 w-full"
              @submit.prevent="handleSubmit"
            >
              <div
                class="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden"
                aria-hidden="true"
              >
                <label for="consent">consent to data processing</label>
                <input
                  id="consent"
                  v-model="form.isConsent"
                  type="checkbox"
                  tabindex="-1"
                />
                <label for="website_url">Leave empty</label>
                <input
                  id="website_url"
                  v-model="trapValue"
                  type="text"
                  name="website_url"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <!-- Имя -->
              <div class="relative">
                <input
                  id="name"
                  v-model="form.name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Name"
                  class="w-full px-5 py-4 rounded-2xl border bg-zinc-100 focus:bg-white focus:outline-none transition-colors"
                  :class="
                    v$.name.$error
                      ? 'border-red-500'
                      : 'border-zinc-200 focus:border-main'
                  "
                />
                <p
                  v-if="v$.name.$error"
                  class="text-red-500 text-xs mt-1.5 px-2 font-medium"
                >
                  {{ v$.name.$errors[0].$message }}
                </p>
              </div>

              <!-- Email -->
              <div class="relative">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="Email address"
                  class="w-full px-5 py-4 rounded-2xl border bg-zinc-100 focus:bg-white focus:outline-none transition-colors"
                  :class="
                    v$.email.$error
                      ? 'border-red-500'
                      : 'border-zinc-200 focus:border-main'
                  "
                />
                <p
                  v-if="v$.email.$error"
                  class="text-red-500 text-xs mt-1.5 px-2 font-medium"
                >
                  {{ v$.email.$errors[0].$message }}
                </p>
              </div>

              <!-- Телефон (с v-maska) -->
              <div class="relative">
                <input
                  id="phone"
                  v-model="form.phone"
                  v-maska="'+## (###) ###-####'"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  placeholder="Phone number"
                  class="w-full px-5 py-4 rounded-2xl border bg-zinc-100 focus:bg-white focus:outline-none transition-colors"
                  :class="
                    v$.phone.$error
                      ? 'border-red-500'
                      : 'border-zinc-200 focus:border-main'
                  "
                />
                <p
                  v-if="v$.phone.$error"
                  class="text-red-500 text-xs mt-1.5 px-2 font-medium"
                >
                  {{ v$.phone.$errors[0].$message }}
                </p>
              </div>

              <!-- Сообщение -->
              <div class="relative col-span-full">
                <textarea
                  id="message"
                  v-model="form.message"
                  name="message"
                  placeholder="Your message"
                  rows="4"
                  class="w-full px-5 py-4 rounded-2xl border bg-zinc-100 focus:bg-white focus:outline-none transition-colors resize-none"
                  :class="
                    v$.message.$error
                      ? 'border-red-500'
                      : 'border-zinc-200 focus:border-main'
                  "
                />
                <p
                  v-if="v$.message.$error"
                  class="text-red-500 text-xs mt-1.5 px-2 font-medium"
                >
                  {{ v$.message.$errors[0].$message }}
                </p>
              </div>

              <!-- Кнопка -->
              <UIBtn
                type="submit"
                main
                :disabled="v$.$invalid"
                class="col-span-full w-full text-lg font-black uppercase transition-colors py-4! rounded-2xl shadow-lg mt-2"
                :class="{ 'opacity-50 bg-zinc-400!': v$.$error }"
              >
                Send
              </UIBtn>
              <p
                v-if="errorMessage"
                class="col-span-full text-red-600 text-sm font-semibold text-center"
              >
                {{ errorMessage }}
              </p>
            </form>
          </ClientOnly>
        </div>
        <div
          class="relative col-span-full lg:col-span-1 bg-main-darkser/80 px-7 py-5 text-smoke rounded-b-4xl lg:rounded-l-none lg:rounded-r-4xl overflow-hidden"
        >
          <PartLogo
            class="w-65 h-65 -z-10 absolute! -right-1/6 top-1/6 -rotate-30"
            class1="hidden!"
            class2="text-smoke-dark! w-60 h-60"
            class3="text-smoke-dark! w-60 h-60"
          />
          <h2 class="mb-7 text-3xl">Contacts</h2>
          <p class="mb-4 text-lg">Contact us in any convenient way</p>
          <p class="mb-8 text-lg">
            Lagina-Lagadas-Thessaloniki Greece, 57200 <br />
            <a href="mailto:info@rent-me.gr">info@rent-me.gr</a>
          </p>
          <ul class="gap-2 flex flex-col text-3xl font-semibold mb-20">
            <li>
              <a href="tel:+306977795840" target="_blank">+306977795840</a>
            </li>
            <li>
              <a href="tel:+302394309999" target="_blank">+302394309999</a>
            </li>
          </ul>
          <div class="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100093357895988"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              class="border border-transparent hover:border-white hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_FACEBOOK" class="text-smoke w-8 h-8" />
            </a>
            <a
              href="viber://chat?number=%2B306977795840"
              aria-label="Viber"
              class="border border-transparent hover:border-white hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_VIBER" class="text-smoke w-8 h-8" />
            </a>
            <a
              href="https://wa.me/306977795840"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              class="border border-transparent hover:border-white hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_WHATSAPP" class="text-smoke w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-full overflow-hidden left-auto -mt-20 -mb-20 lg:-mb-50 -z-10 relative"
    >
      <img src="/map.jpg" alt="map" class="h-142.5 w-full object-cover" />
    </div>
    <UIModal
      v-model="isSuccessModalOpen"
      type="success"
      title="Your message has been sent successfully."
      @close="handleSuccessModalClose"
      @confirm="handleSuccessModalClose"
    >
      <template #note>
        Thank you! Our managers will contact you shortly.
      </template>
    </UIModal>
  </section>
</template>
