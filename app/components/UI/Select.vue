<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const model = defineModel(); // вместо props + emit

const props = defineProps({
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
  <div ref="root" class="relative ui-select">
    <!-- trigger -->
    <div
      class="w-full py-2 h-10 pl-12 pr-4 rounded-xl bg-white text-zinc-700 text-sm cursor-pointer flex items-center"
      @click="toggle"
    >
      {{ selectedOption?.label || placeholder }}
    </div>

    <!-- dropdown -->
    <div
      v-if="isOpen"
      class="absolute mt-1 w-full bg-white rounded-xl shadow-lg z-20 overflow-hidden"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 cursor-pointer"
        @mousedown="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
