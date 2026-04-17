<script setup>
  import { shallowRef, onMounted, onUnmounted, ref } from "vue";

  const props = defineProps({
    x: { type: [Number, String], default: 0 },
    y: { type: [Number, String], default: 0 },
    sticky: { type: Boolean, default: false },
    global: { type: Boolean, default: false },
  });

  const wrapperRef = ref(null);
  const offsetX = shallowRef(0);
  const offsetY = shallowRef(0);
  const isHovered = shallowRef(false);

  function handleMove(e) {
    isHovered.value = true;

    if (props.global) {
      // Для глобального параллакса считаем позицию относительно всего экрана
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;

      offsetX.value = cx * 2;
      offsetY.value = cy * 2;
    } else {
      if (!wrapperRef.value) return;
      const rect = wrapperRef.value.getBoundingClientRect();

      // Проверка на выход за пределы
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        if (isHovered.value) handleLeave();
        return;
      }

      // Относительно центра элемента
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      offsetX.value = cx * 2;
      offsetY.value = cy * 2;
    }
  }

  function handleLeave() {
    isHovered.value = false;
    if (!props.sticky) {
      offsetX.value = 0;
      offsetY.value = 0;
    }
  }

  onMounted(() => {
    if (props.global) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseleave", handleLeave);
    }
  });

  onUnmounted(() => {
    if (props.global) {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    }
  });
</script>
<template>
  <div
    ref="wrapperRef"
    @mousemove="!global ? handleMove($event) : null"
    @mouseleave="!global ? handleLeave() : null">
    <div
      class="transition-transform ease-out"
      :class="isHovered ? 'duration-100' : 'duration-700'"
      :style="`transform: translate(${offsetX * x}px, ${offsetY * y}px);`">
      <slot />
    </div>
  </div>
</template>
