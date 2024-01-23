<script>
  export default {
    props: [
      'tomorrow'
    ],
    data() {
      return {
        intervalId: null,
        timeDifference: { hours: 0, minutes: 0 },
      };
    },
    created(){
      this.calculateTimeDifference();

      this.intervalId = setInterval(() => {
        this.currentDate = new Date();
        this.calculateTimeDifference();
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/tomorrow-salat' });
      },
      calculateTimeDifference() {
        const currentTime = new Date();
        const tomorrowDate = new Date(currentTime);
        tomorrowDate.setDate(currentTime.getDate() + 1);

        const targetTime = new Date( tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), 3, 16);
        const timeDifference = targetTime - currentTime;

        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);

        this.timeDifference = { hours, minutes };
      },
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
            <span>{{ tomorrow.sehri.end_time }}</span>
          </p>
          <p class="flex items-center justify-between">
            <span class="font-light">Iftal</span>
            <span>{{ tomorrow.ifter.start_time }}</span>
          </p>
        </div>
        <div class="next text-center">
          <p class="text-sm font-light">Next Sahri is after</p>
          <p class="text-sm font-light">{{ timeDifference.hours }} hours {{ timeDifference.minutes }} minutes</p>
        </div>
      </div>
    </div>
    <img class="absolute bottom-0 left-0" src="@/assets/images/mosque-bg.svg" alt="Mosque Background Red">
  </div>
</template>