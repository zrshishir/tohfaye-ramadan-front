<script>
  import { RouterLink } from 'vue-router';
  export default {
    computed: {
      showButtonHandler() {
        return this.$route.path !== '/time/upcoming-time';
      }
    }
  }
</script>

<template>
  <div class="scheduling-area text-center">
    <div class="time-scheduling px-5 py-3">
      <p class="time px-4 py-3 text-[13.8px] text-center mb-3 bg-primary text-white rounded-full">Saturday, 13 January 2024 | 30 Jamadius Sani 1445</p>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Tahazzud</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Fazar</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Ishrak</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Sunrise</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Zohar</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Asar</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">sunny</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Magrib</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
      <div class="schedule py-7 px-6 mb-3 border border-primary rounded-xl flex items-center justify-between">
        <p class="text-base">Isha</p>
        <p class="text-base">01:30 am - 05:27 am</p>
      </div>
    </div>
    <RouterLink v-if="showButtonHandler" to="/time/upcoming-time" class="inline-block px-8 py-3 mb-5 bg-primary text-white rounded-full">Next 7 Days</RouterLink>
  </div>
</template>