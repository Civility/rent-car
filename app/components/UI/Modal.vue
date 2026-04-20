<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    default: "OK",
  },
  type: {
    type: String,
    default: "success", // success | error | info | warning
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);

const toneClasses = computed(() => {
  switch (props.type) {
    case "error":
      return {
        badge: "bg-red-600 text-white",
        panel: "from-white via-white to-red-50",
        eyebrow: "text-red-700",
        note: "bg-red-950 text-red-50",
        icon: "!",
      };

    case "warning":
      return {
        badge: "bg-amber-500 text-white",
        panel: "from-white via-white to-amber-50",
        eyebrow: "text-amber-700",
        note: "bg-amber-950 text-amber-50",
        icon: "!",
      };

    case "info":
      return {
        badge: "bg-sky-600 text-white",
        panel: "from-white via-white to-sky-50",
        eyebrow: "text-sky-700",
        note: "bg-sky-950 text-sky-50",
        icon: "i",
      };

    case "success":
    default:
      return {
        badge: "bg-green-600 text-white",
        panel: "from-white via-white to-green-50",
        eyebrow: "text-green-700",
        note: "bg-zinc-950 text-zinc-100",
        icon: "✓",
      };
  }
});

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const confirmModal = () => {
  emit("confirm");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal();
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <div
          class="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-linear-to-br p-7 shadow-2xl"
          :class="toneClasses.panel"
        >
          <button
            type="button"
            class="absolute right-4 top-4 h-10 w-10 rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800"
            @click="closeModal"
          >
            x
          </button>

          <div class="mb-5 flex items-center gap-4">
            <div
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg"
              :class="toneClasses.badge"
            >
              {{ toneClasses.icon }}
            </div>

            <div>
              <p
                class="text-xs font-black uppercase tracking-[0.22em]"
                :class="toneClasses.eyebrow"
              >
                Notification
              </p>
              <h3 class="mt-1 text-2xl font-black leading-tight text-zinc-900">
                {{ title }}
              </h3>
            </div>
          </div>

          <p v-if="message" class="text-sm leading-6 text-zinc-600">
            {{ message }}
          </p>

          <div v-if="$slots.default" class="mt-4">
            <slot />
          </div>

          <div
            class="mt-6 rounded-2xl px-4 py-3 text-sm"
            :class="toneClasses.note"
          >
            <slot name="note">
              Please review the notification and continue.
            </slot>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UIBtn clear class="px-5" @click="closeModal"> Close </UIBtn>

            <UIBtn
              main
              class="px-6 py-3! font-extrabold uppercase"
              @click="confirmModal"
            >
              {{ buttonText }}
            </UIBtn>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
