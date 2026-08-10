<script>
  import api from '@/services/api';
  import TheLoading from '@/components/TheLoading.vue';
  import TheHeader from '@/components/TheHeader.vue';
  import TheSchedule from '@/components/TheSchedule.vue';

  export default {
    components: {
      TheHeader,
      TheSchedule,
      TheLoading,
    }, 
    data(){
      return{
        times: [],
        loading: false,
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
      async getTomorrowTime(){
        this.loading = true;
        try {
          const response = await api.post('/permanent-calendar');
          const result = response.data?.data?.permanent_calendars?.data;
          if (result) {
            for (let i = 0; i < 7; i++) {
              const nextDay = new Date(this.currentDate);
              nextDay.setDate(this.currentDate.getDate() + i + 1); 
              const formattedDate = this.formatDate(nextDay);
              const dayOfMonth = String(nextDay.getDate());
              const nextDayData = result.find(item => item.day === dayOfMonth);
              this.times.push({ date: formattedDate, data: nextDayData })
            }
          }
        } catch (error) {
          this.loading = false;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
    },
    mounted(){
      this.getTomorrowTime();
    }
  } 
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-40 m-auto" src="@/assets/images/logo.png" alt="Next 7 Days">
      <h1 class="text-2xl font-bold mt-3">Next 7 Days</h1>
    </div>
  </the-loading>
  <template v-if="!loading">
    <the-header title="Next 7 Days Scheduling">
      <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl	">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">{{ location?.city }}</span>
      </div>
    </the-header>
    <TheSchedule v-for="(time, index) in times" :key="index" :times="time" />
  </template>
</template>