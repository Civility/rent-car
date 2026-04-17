<script setup>
  import { animate } from "animejs";
  import { ref, onMounted, onUnmounted } from "vue";

  const props = defineProps({
    speed: { type: Number, default: 0.35 },
    reverse: { type: Boolean, default: false },
  });

  const target = ref(null);
  let observer = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        const paths = target.value?.querySelectorAll("path");
        if (!paths?.length) return;

        if (entry.isIntersecting) {
          const delays = [];
          const durations = [];
          let currentDelay = 0;

          paths.forEach((path) => {
            const length = path.getTotalLength();
            const duration = length / props.speed;

            // Сохраняем значения для аниме
            delays.push(currentDelay);
            durations.push(duration);

            // Увеличиваем задержку для следующей линии на время текущей
            currentDelay += duration;

            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = props.reverse
              ? `-${length}`
              : `${length}`;
          });

          animate(paths, {
            strokeDashoffset: 0,
            easing: "linear", // Делаем скорость равномерной, чтобы линии рисовались слитно
            duration: (el, i) => durations[i],
            delay: (el, i) => delays[i],
          });
        } else {
          paths.forEach((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = props.reverse
              ? `-${length}`
              : `${length}`;
          });
        }
      },
      { threshold: 0.3 },
    );

    if (target.value) observer.observe(target.value);
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
  });
</script>

<template>
  <div
    ref="target"
    class="svg-inview">
    <slot />
  </div>
</template>
