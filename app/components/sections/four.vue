<script setup>
  const rules = [
    "To rent a car, it is necessary to present documents confirming your identity. Cars are rented to individuals who have reached the age of 23. The minimum driving experience is 3 years.",
    "Insurance packages are not provided for drivers over 70 years old.",
    "You can pay for the car rental service in cash or by credit card. All prices are indicated including VAT.",
    "At the time of renting the car, you receive the vehicle with a full tank of fuel. Upon the end of the rental period, the car should be returned with the same fuel level.",
    "If you need to extend the rental period, you should notify Rent Me representative no later than one day before the rental period specified in the contract ends.",
    "Clients who return the car before the end of the rental period will not be reimbursed for the remaining funds. For long-term rentals of 7 days or more, 50% of the unused rental period cost is refunded.",
    "The costs of parking and fines incurred during the car rental are the responsibility of the renter.",
    "If you lose the key to the rented car, you are required to reimburse its cost.",
    "Delivery of the car to your chosen location is charged separately.",
    "In case of returning the car later than the end of the rental period, the company reserves the right to charge a penalty for each hour or day of delay.",
  ];
</script>
<template>
  <section class="md:pt-20 pb-20 md:pb-30 lg:pb-50">
    <div class="lg:container lg:mx-auto px-4">
      <div
        class="grid lg:gap-[5vw] md:gap-[3vw] gap-10 md:grid-cols-12 grid-cols-1">
        <div class="lg:order-last lg:col-span-7 col-span-full">
          <h2
            class="text-4xl md:text-5xl lg:text-6xl font-medium md:mb-12 mb-7 lg:mb-10">
            Car rental <span class="text-main">terms</span>
          </h2>
          <strong class="block mb-7"
            >Please familiarise yourself with the car rental terms at Rent Me to
            ensure that your experience with the service is as pleasant as
            possible.</strong
          >
          <ul class="flex flex-col gap-4">
            <li
              v-for="(item, id) in rules"
              :key="id"
              class="flex items-start gap-5">
              <span
                class="shrink-0 w-12 h-12 rounded-full bg-main-darkser flex items-center justify-center text-white text-sm font-bold font-unbounded">
                {{ String(++id) }}
              </span>
              <p
                class="leading-normal"
                v-text="item" />
            </li>
          </ul>
        </div>
        <div class="relative lg:order-first lg:col-span-5 col-span-full">
          <div class="relative mb-14 hidden lg:block">
            <div
              class="absolute right-0 -top-1/6 z-10 w-full h-full animate-rules-hand">
              <img
                src="@/assets/webp/hand.webp"
                alt="rules-hand"
                class="w-auto h-auto absolute right-0 top-1/2 pointer-events-none" />
              <img
                src="@/assets/webp/hand-key.webp"
                alt="rules-hand-key"
                class="w-auto h-auto absolute pointer-events-none right-1/3 top-2/3 mt-15 mr-2 -z-10 origin-top animate-rules-key" />
            </div>

            <UIParallax
              sticky
              global
              x="20"
              y="20"
              class="relative rounded-4xl overflow-hidden shadow-2xl lg:h-105 h-80 w-full">
              <img
                src="@/assets/webp/rules-image.webp"
                alt="rules-image"
                class="relative max-w-510 pointer-events-none -top-5 -left-75 object-cover object-top-left" />
            </UIParallax>
          </div>
          <div class="relative mb-14">
            <PartLogo
              class="w-65 h-65 z-10 absolute! left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              class1="hidden!"
              class2="text-white! w-60 h-60"
              class3="text-white! w-60 h-60" />

            <img
              src="@/assets/webp/palm.webp"
              alt="rules-palm"
              class="absolute! bottom-0! left-0 z-20 hidden lg:block" />

            <UIParallax
              sticky
              global
              x="20"
              y="20"
              class="relative rounded-4xl overflow-hidden shadow-2xl lg:h-105 h-80 w-full">
              <img
                src="@/assets/webp/rules-image.webp"
                alt="rules-image"
                class="relative max-w-510 pointer-events-none -top-128 -left-120 object-cover object-top-left" />
            </UIParallax>
          </div>
          <img
            src="@/assets/webp/rules-car.webp"
            alt="rules-car"
            class="absolute lg:-bottom-1/4 -bottom-1/4 md:-bottom-1/3 left-0 object-center lg:w-fit h-fit lg:mb-2 w-80 md:w-[50vw] pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
</template>
