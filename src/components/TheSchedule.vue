<script>
  import { RouterLink } from 'vue-router';
  export default {
    props: [ 'times' ],
    computed: {
      showButtonHandler() {
        return this.$route.path !== '/time/upcoming-time';
      }
    },
    data(){
      return {
        time: this.times?.data,
        prayers: [],
        currentDate: new Date(),
      }
    },
    methods: {
      getCurrentPrayerTime() {
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let todayWeekdayName = weekdays[this.currentDate.getDay()];

        for (let prayer in this.time) {
          const isFriday = todayWeekdayName === 'Friday' ? prayer !== "johr" : prayer !== "jummah";
          if (isFriday && this.time.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && prayer !== "created_at" && prayer !== "updated_at" && prayer !== "forbidden") {
            let prayerTime = this.time[prayer];
            this.prayers.push(prayerTime);
          }
        }
      },
    },
    mounted(){
      this.getCurrentPrayerTime();
    }
  }
</script>

<template>
  <div class="scheduling-area text-center">
    <div class="time-scheduling px-5 py-3">
      <p class="time px-4 py-3 text-base text-center mb-3 bg-primary text-white rounded-full">{{ times?.date }}</p>
      <div v-for="(time, index) in prayers" :key="index" class="schedule py-7 px-5 mb-3 border border-cultured rounded-xl flex items-center justify-between">
        <p class="text-base">{{ time?.text_bn }} ({{ time?.text_ar }})</p>
        <p class="text-base">{{ time?.start_time }} - {{ time?.end_time }}</p>
      </div>
    </div>
    <RouterLink v-if="showButtonHandler" to="/time/upcoming-time" class="inline-block px-8 py-3 mb-5 bg-primary text-white rounded-full">Next 7 Days</RouterLink>
  </div>
</template>