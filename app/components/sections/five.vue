<script setup>
  const asked = [
    {
      title: "How to book a car?",
      text: "<p>Use the convenient form on the <strong> Home page </strong> of Rent Me. Select the car brand you like and the rental period. Submit the completed application and wait for the booking confirmation. Our manager will contact you to confirm the details.</p>",
    },
    {
      title: "Will there be fuel in the car I rent?",
      text: "<p>All cars are rented out with a full tank of fuel. Please note that at the end of the rental period, you must return the car with the same fuel level.</p>",
    },
    {
      title: "What is the mileage limit for the car rental period?",
      text: "<p>There is no mileage limit.</p>",
    },
    {
      title: "How to rent multiple cars at once?",
      text: "<p>During online booking, you can reserve only one car. However, if you are travelling with a large group, you can book multiple vehicles by informing our manager inadvance. Please note that each rented car must have aseparate driver with the corresponding driver's licence.</p>",
    },
    {
      title: "What additional services do you offer?",
      text: "<p>You can request the following additional services:</p> <ul class='list-disc list-inside'><li>Child car seat (free upon request)</li><li>GPS navigation system</li><li>Registration of a second driver</li><li>Car delivery to the location specified by you</li></ul><p>You can order additional services during the bookingprocess, while speaking with a manager, or directly at ouroffice.</p><p>sales services upon client request.</p>",
    },
    {
      title: "Can I choose the location for pick-up or drop-off of the car?",
      text: "<p>Yes, you can. Please specify the desired location during online booking or in a conversation with the manager.</p>",
    },
    {
      title: "What payment methods do you accept?",
      text: "<p>You can pay for car rental services at Rent Me in cash, with VISA, MasterCard, and Maestro bank cards, as well as through the PayPal online payment service.</p>",
    },
    {
      title: "Can I rent a car for a few hours?",
      text: "<p>At Rent Me, you can rent a car even for just one hour. However, you will still need to pay for the minimum rental period, which is a full day.</p>",
    },
    {
      title: "How do I choose a specific car brand?",
      text: "<p>During the booking process, you can specify the exact model — that is the car you will receive.</p>",
    },
    {
      title: "Which documents do I need to provide?",
      text: "<p>To rent a car, you will need to present your passport and an international or national driver's licence. Please note that at the time of rental, the driver must be at least 23 years old. It is also required to have a minimum of 3 years of driving experience.</p>",
    },
    {
      title: "I want to make changes to my reservation. How can I do that?",
      text: "<p>Please write to our customer support at <a href='mailto:rentme@gmail.com'>rentme@gmail.com</a> or call <a href='tel:+305698965677' target='_blank' rel='noreferrer noopener'>+305698965677</a>. Our specialists will review your request and make changes to your reservation if possible.</p>",
    },
    {
      title: "What fuel should be used to refuel a rented car?",
      text: "<p>Information about the type of fuel used in the car is specified in the rental agreement. If you accidentally refuel the vehicle with the wrong fuel, please contact Rent Me customer support immediately.</p>",
    },
    {
      title: "It seems like I got lost...",
      text: "<p>Do not worry! Upon client's request, we provide a map of the area and a GPS navigator. If for some reason you still cannot find your way, please call our hotline. Our managers will guide you on how to get to the location you are interested in.</p>",
    },
    {
      title: "Can I transfer control of the car to third parties?",
      text: "<p>Only if you registered an additional driver when signing the rental agreement. Otherwise, only the person who presents a valid driver's licence and signs the rental agreement with Rent Me can operate the vehicle.</p>",
    },
    {
      title: "How can I extend the car rental period?",
      text: "<p>If you have already rented a car and want to extend the rental period, please call our hotline or visit the Rent Me office directly at least 24 hours before the rental period expires.</p>",
    },
    {
      title:
        "What should I do in emergency situations (breakdown, car theft, traffic accident)? ",
      text: "<p>Contact our support service at <a href='tel:+305698965677' target='_blank' rel='noreferrer noopener'>+305698965677</a> as soon as possible.</p><p>In the case of a traffic accident, please also call emergency services:</p><ul class='list-disc list-inside'><li><a href='tel:112' target='_blank' rel='noreferrer noopener'>Police: 112</a>  (or 100)</li><li> <a href='tel:116' target='_blank' rel='noreferrer noopener'>Ambulance: 166</a></li></ul><p>After calling our hotline, please wait for the arrival of a Rent Me agent who will advise you on how to proceed further.</p>",
    },
  ];
  const openIndexes = ref([]);

  const toggle = (index) => {
    const position = openIndexes.value.indexOf(index);
    if (position !== -1) {
      openIndexes.value.splice(position, 1);
    } else {
      openIndexes.value.push(index);
    }
  };
</script>
<template>
  <section class="md:pt-20 pb-20 md:pb-30 lg:pb-45">
    <div class="lg:container lg:mx-auto px-4">
      <div class="grid gap-10 lg:grid-cols-12 grid-cols-1">
        <div class="lg:col-span-6 col-span-full">
          <h2
            class="text-2xl md:text-5xl lg:text-6xl font-medium mb-12 lg:mb-20">
            Frequently Asked <span class="text-main">Questions</span>
          </h2>
          <div class="flex flex-col gap-2.5 text-zinc-800">
            <div
              v-for="(item, index) in asked"
              :key="index"
              class="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-lg transition-all">
              <!-- Кнопка/Заголовок (Вопрос) -->
              <UIBtn
                clear
                @click="toggle(index)"
                class="w-full justify-between! flex-nowrap py-3! px-4! text-dark! text-left! bg-white hover:bg-zinc-200!"
                :class="{ 'rouded-b-0!': openIndexes.includes(index) }">
                <h3 class="text-md lg:text-base font-semibold pr-4">
                  {{ item.title }}
                </h3>

                <div
                  class="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-100 transition-transform duration-300"
                  :class="{ 'rotate-90': openIndexes.includes(index) }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-zinc-600">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </UIBtn>

              <transition
                enter-active-class="transition-opacity duration-500 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div
                  v-show="openIndexes.includes(index)"
                  class="px-6 pb-6 pt-2 bg-sec/90">
                  <div
                    class="text-lg leading-relaxed text-white prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2"
                    v-html="item.text"></div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="lg:col-span-6 col-span-full hidden lg:flex flex-col">
          <div class="relative rounded-4xl overflow-hidden mb-7 max-w-[80%]">
            <img
              src="@/assets/webp/faq-image-big.webp"
              alt="faq-image-big"
              class="w-full h-full object-cover pointer-events-none" />
          </div>
          <div class="relative">
            <PartLogo
              class="h-40 w-40 z-10 absolute! left-0 -top-25!"
              class1="h-40 w-40"
              class2="text-white!  h-25 w-25"
              class3="text-white! h-25 w-25 " />
            <div class="absolute left-30 -top-15 z-20">
              <img
                src="@/assets/webp/smile.webp"
                alt="faq-smile"
                class="w-13 h-13 object-cover pointer-events-none" />
            </div>
          </div>
          <div
            class="relative rounded-4xl overflow-hidden ml-auto mb-7 max-w-[70%]">
            <img
              src="@/assets/webp/faq-image.webp"
              alt="faq-image"
              class="w-full h-full object-cover pointer-events-none" />
          </div>
          <div class="relative">
            <img
              src="@/assets/webp/leaf-1.webp"
              alt="benefits-leaf-2"
              class="object-cover h-30 pointer-events-none animate-leaf-orbit absolute z-10 left-1/6 top-auto" />
          </div>
          <div class="relative rounded-4xl overflow-hidden mt-auto w-full h-70">
            <img
              src="@/assets/webp/road.webp"
              alt="faq-image"
              class="w-full h-full object-cover object-center pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
