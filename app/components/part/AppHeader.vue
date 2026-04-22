<script setup>
import ICON_VIBER from "@/assets/icons/viber.svg";
import ICON_WHATSAPP from "@/assets/icons/whatsapp.svg";
import ICON_FACEBOOK from "@/assets/icons/facebook.svg";
// const { isMobile, isDesktop } = useDevice();
const { t } = useI18n();
const localePath = useLocalePath();
const isMenuOpen = ref(false);
useHead(() => ({
  htmlAttrs: {
    class: isMenuOpen.value ? "overflow-y-hidden" : "",
  },
}));

const menuItems = computed(() => [
  { name: t("nav.home"), id: "home" },
  { name: t("nav.about"), id: "about" },
  { name: t("nav.terms"), id: "terms" },
  { name: t("nav.faq"), id: "faq" },
  { name: t("nav.contacts"), id: "contacts" },
]);
</script>
<template>
  <header
    class="sticky top-0 z-40 bg-linear-to-r from-[#fe8f47] from-10% via-[#ca390f] via-20% to-[#8b1504] to-100% w-full border-b border-zinc-200/50 backdrop-blur-md transition-all duration-500"
    :class="{
      'h-screen overflow-y-auto from-[#8b1504]! via-80% to-[#fe8f47]':
        isMenuOpen,
    }"
  >
    <div
      class="lg:container lg:mx-auto md:h-20 h-15 flex items-center justify-between shrink-0"
      :class="{ 'h-full items-start!': isMenuOpen }"
    >
      <ClientOnly
        ><NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2 self-start z-60 relative"
        >
          <PartLogo
            class="max-w-24 w-20 h-20 md:w-32 md:h-32 md:max-w-44 lg:max-w-48 after:content-[''] after:absolute after:right-0 after:-top-4 after:-z-10 after:h-50 after:w-50 after:bg-[url('~/assets/webp/shape.webp')] after:bg-contain after:bg-no-repeat after:rotate-60 after:-scale-x-100 after:pointer-events-none before:content-[''] before:absolute before:left-2/3 before:top-1/10 before:z-30 before:h-22 before:w-40 before:bg-[url('~/assets/webp/leaf-5.webp')] before:bg-contain before:bg-no-repeat before:pointer-events-none before:filter-[drop-shadow(-10px_3px_5px_rgba(0,0,0,0.5))]"
            class1="h-20! w-20! md:h-32! md:w-32!"
            class2="text-white!  h-13! w-13! md:h-22! md:w-22!"
            class3="text-white! h-13! w-13! md:h-22! md:w-22!"
          /> </NuxtLink
      ></ClientOnly>

      <nav
        class="mx-auto pt-8 lg:block hidden absolute lg:static inset-0 max-lg:container"
        :class="{ 'block! mt-20 pt-0 ': isMenuOpen }"
      >
        <ul
          class="flex items-center gap-8 pb-8"
          :class="{ 'flex-col items-start': isMenuOpen }"
        >
          <li v-for="item in menuItems" :key="item.id" class="w-full">
            <a
              :href="`/#${item.id}`"
              class="text-zinc-100 active:text-white lg:hover:text-zinc-100 opacity-80 text-nowrap inline-flex w-full hover:opacity-100 relative pl-6 text-lg lg:text-md font-medium transition-colors before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:rounded-full before:bg-[url('~/assets/icons/menu-star.svg')] before:bg-no-repeat before:bg-center before:bg-contain"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
        <address
          class="mt-auto pb-10 pt-8 border-t lg:border-zinc-800 border-zinc-200 not-italic lg:hidden"
        >
          <p class="text-zinc-300 font-bold text-md mb-2">
            {{ t("contacts.title") }}
          </p>

          <div class="flex flex-col mb-4">
            <a
              href="tel:+306977795840"
              class="text-white font-semibold text-md hover:underline"
            >
              +30 697 779 5840
            </a>
            <a
              href="tel:+302394309999"
              class="text-white font-semibold text-md hover:underline"
            >
              +30 239 430 9999
            </a>
          </div>

          <p class="text-zinc-300 font-semibold text-md">
            Lagina-Lagadas-Thessaloniki <br />
            Greece, 57200 <br />
            <a href="mailto:info@rent-me.gr" class="text-white hover:underline">
              info@rent-me.gr
            </a>
          </p>

          <div class="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/profile.php?id=100093357895988"
              target="_blank"
              rel="noopener"
              class="border border-transparent hover:border-white/70 hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_FACEBOOK" class="text-white w-6 h-6" />
            </a>
            <a
              href="viber://chat?number=%2B306977795840"
              aria-label="Viber"
              class="border border-transparent hover:border-white/70 hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_VIBER" class="text-white w-6 h-6" />
            </a>
            <a
              href="https://wa.me/306977795840"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              class="border border-transparent hover:border-white/70 hover:bg-smoke-dark/50 rounded-4xl p-2"
            >
              <UISvg :svg="ICON_WHATSAPP" class="text-white w-6 h-6" />
            </a>
          </div>
        </address>
      </nav>

      <div
        class="flex items-center gap-4 z-60 self-start pt-4 absolute right-0"
      >
        <PartLangSwitcher />
        <UIBtn
          clear
          class="lg:hidden! p-4! text-white hover:bg-white/10 rounded-xl transition-colors active:scale-90"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <div class="w-6 h-4 flex flex-col justify-between overflow-hidden">
            <span
              v-for="i in 3"
              :key="i"
              :class="[
                'h-0.5 w-full bg-current transition-all duration-300',
                isMenuOpen && i === 1 ? 'rotate-45 translate-y-1.75' : '',
                isMenuOpen && i === 2 ? '-translate-x-full opacity-0' : '',
                isMenuOpen && i === 3 ? '-rotate-45 -translate-y-1.75' : '',
              ]"
            />
          </div>
        </UIBtn>
      </div>
    </div>
    <PartBookingFlowNav :class="{ hidden: isMenuOpen }" />
  </header>
</template>
