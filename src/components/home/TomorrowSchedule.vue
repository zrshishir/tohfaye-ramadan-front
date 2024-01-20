<script>
  export default {
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/tomorrow-salat' });
      }
    }
  }
</script>

<template>
  <div @click="clickHandler()" class="tomorrow-schedule bg-primary mt-3 h-28 relative rounded-2xl overflow-auto">
    <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
      <h3 class="pb-3 text-base font-normal text-center">Tomorrow’s Schedule</h3>
      <div class="schedule-contant flex items-center justify-between gap-6">
        <div class="time flex-1">
          <p class="flex items-center justify-between">
            <span class="font-light">Sahri is over</span>
            <span>05.00 AM</span>
          </p>
          <p class="flex items-center justify-between">
            <span class="font-light">Iftal</span>
            <span>05.00 AM</span>
          </p>
        </div>
        <div class="next text-center">
          <p class="text-sm font-light">Next Sahri is after</p>
          <p class="text-sm font-light">6 hours 46 minutes</p>
        </div>
      </div>
    </div>
    <img class="absolute bottom-0 left-0" src="@/assets/images/mosque-bg.svg" alt="Mosque Background Red">
  </div>
</template>