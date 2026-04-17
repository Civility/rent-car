<template>
  <component
    :is="svg"
    class="inline-block fill-current w-6 h-6"
    role="img"
    fill="currentColor"
    aria-hidden="true" />
</template>

<script setup>
  defineProps({
    svg: {
      type: [Object, String],
      required: true,
    },
  });
</script>
