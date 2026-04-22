<script setup>
const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const isOpen = ref(false);

const current = computed(() =>
  locales.value.find((l) => l.code === locale.value),
);
const others = computed(() =>
  locales.value.filter((l) => l.code !== locale.value),
);

const choose = async (code) => {
  isOpen.value = false;
  await navigateTo(switchLocalePath(code));
  setLocale(code);
};
</script>

<template>
  <div class="relative">
    <UIBtn
      class="rounded-full! border! border-white/40! px-2.5! py-1! hover:bg-white/10! transition-colors!"
      :aria-label="$t('langSwitcher.label')"
      @click="isOpen = !isOpen"
    >
      <img
        :src="`/flags/${current.flag}.svg`"
        :alt="current.name"
        class="w-5 h-5 rounded-full object-cover"
      />
      <span class="font-semibold">{{ current.name }}</span>
    </UIBtn>

    <transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute right-0 mt-2 min-w-fit rounded-xl bg-white shadow-lg border border-zinc-200 overflow-hidden z-50"
      >
        <li v-for="l in others" :key="l.code">
          <UIBtn
            class="flex items-center gap-2 w-full px-3 py-2 hover:bg-sec! text-dark!"
            @click="choose(l.code)"
          >
            <img
              :src="`/flags/${l.flag}.svg`"
              :alt="l.name"
              class="w-5 h-5 rounded-full object-cover"
            />
            <span class="font-semibold">{{ l.name }}</span>
          </UIBtn>
        </li>
      </ul>
    </transition>
  </div>
</template>
