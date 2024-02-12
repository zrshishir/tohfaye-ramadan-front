<script>
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: {
      TheHeader,
    },
    data(){
      return {
        time: null,
        prayers: [],
        currentDate: new Date(),
        location: JSON.parse(localStorage.getItem('location')),
      }
    },
    methods: {
      formatDate(date) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      },
      formatTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.formatDate(tomorrow);
      },
      getTodayTime(){
        const today = String(new Date().getDate() + 1).padStart(2, '0');
        const times = JSON.parse(localStorage.getItem('calendarData'));

        const todayData = times.find(item => item.day === today);
        this.time = todayData;
      },
      getCurrentPrayerTime() {
        for (let prayer in this.time) {
          if (this.time.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && prayer !== "created_at" && prayer !== "updated_at" && prayer !== "forbidden") {
            this.prayers.push(this.time[prayer]);
          }
        }
      },
    },
    mounted(){
      this.getTodayTime();
      this.getCurrentPrayerTime();
    }
  } 
</script>

<template>
  <the-header title="Tomorrow Schedule">
    <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl	">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">{{ location?.city }}</span>
    </div>
  </the-header>
  <div class="scheduling-area text-center">
    <div class="time-scheduling px-5 py-3">
      <p class="time px-4 py-3 text-base text-center mb-3 bg-primary text-white rounded-full">{{ formatTomorrowDate() }}</p>
      <div v-for="(time, index) in prayers" :key="index" class="schedule py-7 px-5 mb-3 border border-cultured rounded-xl flex items-center justify-between">
        <p class="text-base">{{ time?.text_bn }} ({{ time?.text_ar }})</p>
        <p class="text-base">{{ time?.start_time }} - {{ time?.end_time }}</p>
      </div>
    </div>
    <RouterLink to="/time/upcoming-time" class="inline-block px-8 py-3 mb-5 bg-primary text-white rounded-full">Next 7 Days</RouterLink>
  </div>
</template>