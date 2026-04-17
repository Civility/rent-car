<script setup>
  const model = defineModel(); // вместо props + emit

  const props = defineProps({
    id: { type: String, default: undefined },
    options: { type: Array, required: true },
    placeholder: { type: String, default: "Select" },
  });

  const isOpen = ref(false);
  const root = ref(null);

  const selectedOption = computed(() =>
    props.options.find((o) => o.value === model.value),
  );

  const selectOption = (option) => {
    model.value = option.value;
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const clickOutside = (e) => {
    if (!root.value?.contains(e.target)) {
      isOpen.value = false;
    }
  };

  onMounted(() => document.addEventListener("click", clickOutside));
  onBeforeUnmount(() => document.removeEventListener("click", clickOutside));
</script>

<template>
  <div
    ref="root"
    class="relative ui-select w-full min-w-0">
    <input
      type="text"
      :name="id"
      :value="modelValue"
      tabindex="-1"
      aria-hidden="true"
      class="sr-only"
      readonly />

    <!-- trigger -->
    <div
      :id="id"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      class="w-full py-2 h-10 pl-8 pr-4 rounded-xl bg-white text-zinc-700 text-sm cursor-pointer grid grid-cols-[1fr_auto] items-center gap-2 transition-colors hover:bg-zinc-50"
      @click="toggle"
      @keydown.enter.space.prevent="toggle">
      <div class="flex-1 overflow-hidden mr-2">
        <span class="block truncate w-full text-left">
          {{ selectedOption?.label || placeholder }}
        </span>
      </div>

      <!-- Иконка шеврона -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="shrink-0 text-zinc-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <!-- dropdown -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <div
        v-if="isOpen"
        class="absolute mt-1 w-full bg-white rounded-xl shadow-lg border border-zinc-100 z-50 overflow-hidden max-h-60 overflow-y-auto">
        <div
          v-for="option in options"
          :key="option.value"
          class="px-4 py-2.5 text-sm text-zinc-700 hover:bg-main hover:text-white cursor-pointer transition-colors wrap-break-word whitespace-normal leading-tight"
          :class="{ 'bg-zinc-50 font-medium': option.value === model.value }"
          @mousedown="selectOption(option)">
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>
