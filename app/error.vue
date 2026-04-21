<script setup>
  const props = defineProps({
    error: {
      type: Object,
      required: true,
    },
  });

  useHead({
    title: `Error ${props.error?.statusCode || ""} | Rent-Me`,
  });

  const isNotFound = computed(() => props.error?.statusCode === 404);

  const title = computed(() => {
    if (isNotFound.value) return "Page not found";
    if (props.error?.statusCode === 403) return "Access denied";
    if (props.error?.statusCode >= 500) return "Server error";
    return "Something went wrong";
  });

  const description = computed(() => {
    if (isNotFound.value) {
      return "The page you are looking for doesn't exist or has been moved.";
    }
    if (props.error?.statusCode === 403) {
      return "You don't have permission to view this page.";
    }
    if (props.error?.statusCode >= 500) {
      return "Our servers are having trouble right now. Please try again shortly.";
    }
    return (
      props.error?.message || "An unexpected error occurred. Please try again."
    );
  });

  const handleHome = () => {
    clearError({ redirect: "/" });
  };

  const handleReload = () => {
    if (import.meta.client) {
      window.location.reload();
    }
  };
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-smoke">
    <div
      class="relative w-full max-w-xl text-center bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12">
      <p
        class="text-[10rem] md:text-[12rem] leading-none font-black bg-linear-to-r from-[#fe8f47] via-[#ca390f] to-[#8b1504] bg-clip-text text-transparent select-none">
        {{ error?.statusCode || "Oops" }}
      </p>

      <h1 class="text-2xl md:text-3xl font-bold text-dark mb-3">
        {{ title }}
      </h1>

      <p class="text-base text-gray-600 mb-8">
        {{ description }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <UIBtn
          main
          class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase"
          @click="handleHome">
          Back to home
        </UIBtn>

        <UIBtn
          clear
          class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase border border-gray-300 hover:bg-gray-50"
          @click="handleReload">
          Reload page
        </UIBtn>
      </div>

      <details
        v-if="error?.stack && $config.public.showErrorStack"
        class="mt-8 text-left">
        <summary class="cursor-pointer text-sm text-gray-500">
          Technical details
        </summary>
        <pre
          class="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs overflow-auto whitespace-pre-wrap"
          >{{ error.stack }}</pre
        >
      </details>
    </div>
  </div>
</template>
