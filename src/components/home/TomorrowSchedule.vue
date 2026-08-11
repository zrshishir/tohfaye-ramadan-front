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
      /**
       * "06:32 PM" -> a Date on the given day.
       *
       * The previous version split on /:| / and used the hour directly, discarding the
       * AM/PM entirely — so iftar at 06:32 PM was treated as 06:32 in the morning and
       * the countdown was ~12 hours out.
       */
      timeOnDate(value, date) {
        const match = String(value ?? '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;

        let [, hour, minute, meridiem] = match;
        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);

        if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0;

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
      },

      /** Whole hours and minutes from now until `target`, never negative. */
      countdownTo(target) {
        const diff = target - new Date();
        if (diff <= 0) return { hours: 0, minutes: 0 };

        return {
          hours: Math.floor(diff / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
        };
      },

      calculateTimeDifferenceSehri() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const target = this.timeOnDate(this.tomorrow?.sehri?.end_time, tomorrow);
        this.timeDifferenceSehri = target ? this.countdownTo(target) : { hours: 0, minutes: 0 };
      },
      calculateTimeDifferenceIftar() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const target = this.timeOnDate(this.tomorrow?.iftar?.start_time, tomorrow);
        this.timeDifferenceIftar = target ? this.countdownTo(target) : { hours: 0, minutes: 0 };
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
            <span>{{ tomorrow?.iftar?.start_time }} - {{ timeDifferenceIftar?.hours }} h {{ timeDifferenceIftar?.minutes <= 9 ? "0" : "" }}{{ timeDifferenceIftar?.minutes }} m (Left)</span>
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