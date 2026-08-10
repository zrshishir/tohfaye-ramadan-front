<script>
  export default {
    props: [
      'tomorrow'
    ],
    data() {
      return {
        intervalId: null,
        timeDifferenceSehri: { hours: 0, minutes: 0 },
        timeDifferenceIftar: { hours: 0, minutes: 0 },
      };
    },
    created(){
      this.calculateTimeDifferenceSehri();
      this.calculateTimeDifferenceIftar();

      this.intervalId = setInterval(() => {
        this.currentDate = new Date();
        this.calculateTimeDifferenceSehri();
        this.calculateTimeDifferenceIftar();
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/tomorrow-salat' });
      },
      calculateTimeDifferenceSehri() {
        if (!this.tomorrow?.sehri?.start_time) {
          this.timeDifferenceSehri = { hours: 0, minutes: 0 };
          return;
        }
        const [hour, minute] = this.tomorrow.sehri.start_time.split(/:| /);
        const currentTime = new Date();
        const tomorrowDate = new Date(currentTime);
        tomorrowDate.setDate(currentTime.getDate() + 1);

        const targetTime = new Date( tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), hour, minute);
        const timeDifference = targetTime - currentTime;

        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);

        this.timeDifferenceSehri = { hours, minutes };
      },
      calculateTimeDifferenceIftar() {
        if (!this.tomorrow?.ifter?.start_time) {
          this.timeDifferenceIftar = { hours: 0, minutes: 0 };
          return;
        }
        const [hour, minute] = this.tomorrow.ifter.start_time.split(/:| /);
        const currentTime = new Date();
        const tomorrowDate = new Date(currentTime);
        tomorrowDate.setDate(currentTime.getDate() + 1);

        const targetTime = new Date( tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate(), hour, minute);
        const timeDifference = targetTime - currentTime;

        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);

        this.timeDifferenceIftar = { hours, minutes };
      },
    }
  }
</script>

<template>
  <div @click="clickHandler()" class="tomorrow-schedule bg-primary mt-3 h-28 relative rounded-2xl overflow-auto">
    <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
      <h3 class="pb-3 text-base font-normal text-center">Tomorrow’s Schedule</h3>
      <div class="schedule-contant">
        <div class="time">
          <p class="flex items-center justify-between">
            <span class="font-light">Sehri (Over)</span>
            <span>{{ tomorrow?.sehri?.end_time }} - {{ timeDifferenceSehri?.hours }} h {{ timeDifferenceSehri?.minutes <= 9 ? "0" : "" }}{{ timeDifferenceSehri?.minutes }} m (Left)</span>
          </p>
          <p class="flex items-center justify-between">
            <span class="font-light">Iftar</span>
            <span>{{ tomorrow?.ifter?.start_time }} - {{ timeDifferenceIftar?.hours }} h {{ timeDifferenceIftar?.minutes <= 9 ? "0" : "" }}{{ timeDifferenceIftar?.minutes }} m (Left)</span>
          </p>
        </div>
        <!-- <div class="next text-center pt-3">
          <p class="text-base font-light pb-1">Next Sehri is after {{ timeDifferenceSehri?.hours }} hours {{ timeDifferenceSehri?.minutes <= 9 ? "0" : "" }}{{ timeDifferenceSehri?.minutes }} minutes</p>
          <p class="text-base font-light">Next Iftar is after {{ timeDifferenceIftar?.hours }} hours {{ timeDifferenceIftar?.minutes <= 9 ? "0" : "" }}{{ timeDifferenceIftar?.minutes }} minutes</p>
        </div> -->
      </div>
    </div>
    <img class="absolute bottom-0 left-0" src="@/assets/images/mosque-bg.svg" alt="Mosque Background Red">
  </div>
</template>