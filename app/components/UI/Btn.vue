<script setup>
const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  main: { type: Boolean },
  sec: { type: Boolean },
  clear: { type: Boolean },
  glue: { type: Boolean },
});

const isComponent = computed(() =>
  props.to ? resolveComponent("NuxtLink") : "button",
);
const isType = computed(() => (props.to ? null : "button"));

const isClass = computed(() => {
  return {
    "btn--main": props.main,
    "btn--sec": props.sec,
    "btn--clear": props.clear,
    "btn--glue": props.glue,
  };
});
</script>

<template>
  <component
    :is="isComponent"
    class="btn"
    :class="isClass"
    :type="isType"
    :to="to"
  >
    <slot />
  </component>
</template>
<style scoped>
@reference "../../assets/main.css";
.btn {
  @apply rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all outline-none bg-transparent;
  @apply text-zinc-100 py-1.5;
  @apply disabled:cursor-not-allowed disabled:opacity-70;
}
.btn--main {
  @apply relative bg-main-dark hover:bg-main/90 shadow-lg;
}
.btn--sec {
  @apply relative bg-sec hover:bg-sec/70 shadow-lg;
}
.btn--clear {
  @apply py-0! shadow-none! rounded-none;
}
</style>
<!-- <style scoped>
@reference "tailwindcss";
.btn {
  @apply rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all outline-none border-none bg-transparent;
  @apply disabled:cursor-not-allowed disabled:opacity-70;
}
.btn--main {
  @apply relative bg-main-dark;
  @apply hover:bg-main hover:-translate-y-px active:translate-y-0 active:scale-95;
}

.btn--clear {
  @apply p-0 justify-start text-inherit rounded-none;
}

.btn--glue {
  @apply after:content-[''] after:absolute after:inset-0 after:z-10;
}
</style> -->
