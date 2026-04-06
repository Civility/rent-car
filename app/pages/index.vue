<script setup>
// const { isMobile, isDesktop } = useDevice();
</script>
<template>
  <main>
    <SectionsOne id="home" />

    <section id="about" class="py-20 border-t">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold">About Us</h2>
        <p class="mt-4 text-slate-600">Best car rental service since 2026.</p>
      </div>
    </section>

    <section id="terms" class="py-20 bg-slate-50 border-t">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold">Rental Terms</h2>
      </div>
    </section>

    <section id="faq" class="py-20 border-t">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold">FAQ</h2>
      </div>
    </section>

    <section id="contact" class="py-20 bg-blue-600 text-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold">Contact Us</h2>
      </div>
    </section>
  </main>
</template>
