<script setup>
const { tm, rt } = useI18n();
const asked = computed(() => {
  const items = tm("faq.items");
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    title: rt(item.title),
    text: rt(item.text),
  }));
});

// const asked = computed(() => tm("faq.items"));
const openIndexes = ref([]);

const toggle = (index) => {
  const position = openIndexes.value.indexOf(index);
  if (position !== -1) {
    openIndexes.value.splice(position, 1);
  } else {
    openIndexes.value.push(index);
  }
};
</script>
<template>
  <section class="md:pt-20 pb-20 md:pb-30 lg:pb-45">
    <div class="lg:container lg:mx-auto px-4">
      <div class="grid gap-10 lg:grid-cols-12 grid-cols-1">
        <div class="lg:col-span-6 col-span-full">
          <h2
            class="text-2xl md:text-5xl lg:text-6xl font-medium mb-12 lg:mb-20"
          >
            {{ $t("faq.title0") }}
            <span class="text-main">{{ $t("faq.title") }}</span>
          </h2>
          <div class="flex flex-col gap-2.5 text-zinc-800">
            <div
              v-for="(item, index) in asked"
              :key="index"
              class="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-lg transition-all"
            >
              <!-- Кнопка/Заголовок (Вопрос) -->
              <UIBtn
                clear
                class="w-full justify-between! flex-nowrap py-3! px-4! text-dark! text-left! bg-white hover:bg-zinc-200!"
                :class="{ 'rouded-b-0!': openIndexes.includes(index) }"
                @click="toggle(index)"
              >
                <h3 class="text-md lg:text-base font-semibold pr-4">
                  {{ item.title }}
                </h3>

                <div
                  class="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-100 transition-transform duration-300"
                  :class="{ 'rotate-90': openIndexes.includes(index) }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-zinc-600"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </UIBtn>

              <transition
                enter-active-class="transition-opacity duration-500 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-show="openIndexes.includes(index)"
                  class="px-6 pb-6 pt-2 bg-sec/90"
                >
                  <div
                    class="text-lg leading-relaxed text-white prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2"
                    v-html="item.text"
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 col-span-full hidden lg:block">
          <div class="relative rounded-4xl overflow-hidden mb-7 max-w-[80%]">
            <img
              src="@/assets/webp/faq-image-big.webp"
              alt="faq-image-big"
              aria-hidden="true"
              class="w-full h-full object-cover pointer-events-none"
            />
          </div>
          <div class="relative">
            <PartLogo
              class="h-40 w-40 z-10 absolute! left-0 -top-25!"
              class1="h-40 w-40"
              class2="text-white!  h-25 w-25"
              class3="text-white! h-25 w-25 "
            />
            <div class="absolute left-30 -top-15 z-20">
              <img
                src="@/assets/webp/smile.webp"
                alt="faq-smile"
                aria-hidden="true"
                class="w-13 h-13 object-cover pointer-events-none"
              />
            </div>
          </div>
          <div
            class="relative rounded-4xl overflow-hidden ml-auto mb-7 max-w-[70%]"
          >
            <img
              src="@/assets/webp/faq-image.webp"
              alt="faq-image"
              aria-hidden="true"
              class="w-full h-full object-cover pointer-events-none"
            />
          </div>
          <div class="relative">
            <img
              src="@/assets/webp/leaf-1.webp"
              alt="benefits-leaf-2"
              aria-hidden="true"
              class="object-cover h-30 pointer-events-none animate-leaf-orbit absolute z-10 left-1/6 top-auto"
            />
          </div>
          <div class="rounded-4xl overflow-hidden w-[70%] mr-auto">
            <img
              src="@/assets/webp/road.webp"
              alt="faq-image"
              aria-hidden="true"
              class="w-full h-full object-cover object-center pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
