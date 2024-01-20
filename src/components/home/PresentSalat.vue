<script>
  export default {
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/present-time' });
      }
    }
  }
</script>

<template>
  <div @click="salatTimeHandler('present')" class="present-salat bg-primary my-3 h-36 relative rounded-2xl overflow-auto">
    <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
      <h3 class="pb-3 text-lg font-normal">Present Time</h3>
      <div class="salat flex items-center justify-between">
        <div class="salat-name flex items-center gap-2">
          <div class="dot bg-lightWhite w-6 h-6 rounded-full flex items-center justify-center">
            <span class="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <p class="text-lg font-medium">Esha</p>
        </div>
        <p class="text-lg font-medium">8:22 PM - 12:22 AM</p>
      </div>
      <p class="my-2 text-base font-light">Time left: 3 hours 18 minutes</p>
      <div class="time-slides relative">
        <div class="slide absolute top-0 left-0 w-full h-1 bg-lightWhite rounded-full"></div>
        <div class="slide absolute top-0 left-0 w-2/4 h-1 bg-white rounded-full"></div>
      </div>
    </div>
    <img src="@/assets/images/mosque-bg.svg" class="absolute left-0 bottom-0" alt="Mosque Background" >
  </div>
</template>