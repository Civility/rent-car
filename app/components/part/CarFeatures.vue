<script setup>
  const props = defineProps({
    car: { type: Object, required: true },
    // Кол-во колонок в grid (по умолчанию адаптив через классы ниже)
    columns: { type: Number, default: null },
  });

  const features = computed(() => props.car?.features ?? {});

  const items = computed(() => {
    const f = features.value;
    const list = [
      { key: "seats", icon: "👥", value: f.seats, tooltip: "Seats" },
      { key: "doors", icon: "🚪", value: f.doors, tooltip: "Doors" },
      { key: "bags", icon: "🧳", value: f.bags, tooltip: "Bags" },
      {
        key: "transmission",
        icon: "⚙️",
        value: f.transmission,
        tooltip: f.transmission === "A" ? "Automatic" : "Manual",
      },
    ];

    if (f.ac) {
      list.push({
        key: "ac",
        icon: "❄️",
        value: "A/C",
        tooltip: "Air Conditioning",
      });
    }

    list.push({
      key: "age",
      icon: "🆔",
      value: f.age ? `${f.age}+` : null,
      tooltip: "Minimum age",
    });

    return list.filter(
      (item) => item.value !== undefined && item.value !== null,
    );
  });

  const gridStyle = computed(() =>
    props.columns
      ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }
      : null,
  );
</script>

<template>
  <div
    :style="gridStyle"
    :class="[
      'grid gap-x-3 gap-y-3 text-sm font-bold text-gray-700',
      columns ? '' : 'grid-cols-3 md:grid-cols-6',
    ]">
    <div
      v-for="item in items"
      :key="item.key"
      class="relative group flex items-center justify-center gap-1.5 cursor-help">
      <span class="flex items-center gap-1">
        <span>{{ item.icon }}</span>
        <span class="text-xs">{{ item.value }}</span>
      </span>

      <div
        v-if="item.tooltip"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs font-normal rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
        {{ item.tooltip }}
        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800" />
      </div>
    </div>
  </div>
</template>
