<script>
  import axios from 'axios';
  import moment from 'moment';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';

  export default {
    components: { 
      TheHeader,
      TheLoading,
      TheError,
    },
    data(){
      return {
        loading: false,
        error: false,
        ramadanCalender: [],
        location: JSON.parse(localStorage.getItem('location')),
        storedRamadanCalender: localStorage.getItem('Ramadan-Calender'),
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        if (this.storedRamadanCalender) {
          this.ramadanCalender = JSON.parse(this.storedRamadanCalender);
          this.loading = false;
          this.error = false;
        } else {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ramazan-calendar`);
            this.ramadanCalender = response.data?.data?.permanent_calendars;
            localStorage.setItem('Ramadan-Calender', JSON.stringify(this.ramadanCalender));
            this.loading = false;
            this.error = false;           
          } catch (error) {
            this.loading = false;
            this.error = true;
            console.error('Error fetching data:', error);
          }
        }
      },
      isToday(day) {
        const currentDate = moment().format('YYYY-MM-DD');        
        return currentDate === `2024-03-${day}`;
      },
      getWeekName(day) {
        const date = moment(`2024-03-${day}`, 'YYYY-MM-DD');
        return date.format('ddd').slice(0, 3);
      },
      getDayWithMonthName(day, month_id) {
        const date = moment(`2024-${month_id}-${day}`, 'YYYY-MM-DD');
        return date.format('MMMM');
      },
    },
    mounted() {
      this.fetchData();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="@/assets/images/icons/moon.svg" alt="ramadan-calendar">
      <h1 class="text-2xl font-bold mt-3">Ramadan Calendar</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading">
    <the-header title="Ramadan Calendar" class="bg-primary text-white">
      <div class="location flex items-start gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">{{ location?.city }}</span>
      </div>
    </the-header>
    <div class="ramadan-area">
      <div class="ramadan-header text-center text-white bg-primary py-1">
        <div class="bg-ramadan p-6 bg-no-repeat bg-contain bg-center m-5">
          <h1 class="text-2xl font-bold">Ramadan - 2024</h1>
          <p class="pt-1">Sheri and Iftar time alart</p>
        </div>
      </div>
      <div class="ramadan-calendar">
        <div class="calendar-head">
          <div class="content grid grid-cols-5">
            <div class="bg-darkGreen text-white py-3 text-center border-r-2 border-gainsboro">Day</div>
            <div class="bg-darkGreen text-white py-3 text-center border-r-2 border-gainsboro">Date</div>
            <div class="bg-darkGreen text-white py-3 text-center border-r-2 border-gainsboro">Ramadan</div>
            <div class="bg-darkGreen text-white py-3 text-center border-r-2 border-gainsboro">Sheri</div>
            <div class="bg-darkGreen text-white py-3 text-center">Iftar</div>
          </div>
        </div>
        <div class="calendar-body">     
          <RouterLink 
            v-for="(ramadan, index) in ramadanCalender" 
            :key="index" 
            :to="`/ramadan/${ramadan?.id}`" 
            :class="`content ${isToday(ramadan?.day) && 'current-ramadan'} grid grid-cols-5 gap-[1px] border-b border-primary`"
          >
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ getWeekName(ramadan?.day) }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ ramadan?.day }} {{ getDayWithMonthName(ramadan?.day, ramadan?.month_id) }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ index + 1 }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ ramadan?.sehri?.end_time }}</div>
            <div class="text-center py-3 font-medium">{{ ramadan?.magrib?.start_time }}</div>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
</template>