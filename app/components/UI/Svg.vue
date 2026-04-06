<template>
  <component :is="svg" class="inline-block fill-current w-6 h-6" />
</template>

<script setup>
defineProps({
  svg: {
    type: [Object, String],
    required: true,
  },
});
</script>
