<script>
  import api from '@/services/api';
  import { calendarParams } from '@/services/settings';
  import { cached, TTL } from '@/services/cache';
  import moment from 'moment';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: { 
      TheHeader,
      TheLoading,
      TheError,
      TheNoData
    },
    data(){
      return {
        loading: false,
        error: false,
        ramadanCalender: [],
        location: JSON.parse(localStorage.getItem('location')),

      }
    },
    computed: {
      calendarYear() {
        return moment().year();
      },
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const { value } = await cached('ramadanCalendar', TTL.ramadanCalendar, async () => {
            const response = await api.get('/ramazan-calendar', { params: calendarParams() });
            return response.data?.data?.permanent_calendars ?? [];
          });
          this.ramadanCalender = value;
          this.error = false;
        } catch (error) {
          this.error = true;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      /** The calendar spans the current month, so the year is simply this year. */
      dateFor(day, month_id) {
        const year = moment().year();
        return moment(`${year}-${String(month_id).padStart(2, '0')}-${String(day).padStart(2, '0')}`, 'YYYY-MM-DD');
      },
      isToday(day, month_id) {
        // Was pinned to 2024-03, so nothing was ever "today" after Ramadan 2024.
        return this.dateFor(day, month_id).isSame(moment(), 'day');
      },
      getWeekName(day, month_id) {
        const date = this.dateFor(day, month_id);
        return date.format('ddd').slice(0, 3);
      },
      getDayWithMonthName(day, month_id) {
        const date = this.dateFor(day, month_id);
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
    <TheNoData v-if="ramadanCalender === 0"/>
    <div v-if="ramadanCalender !== 0" class="ramadan-area">
      <div class="ramadan-header text-center text-white bg-primary py-1">
        <div class="p-6 m-5">
          <h1 class="text-2xl font-bold">Ramadan - {{ calendarYear }}</h1>
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
            :class="`content ${isToday(ramadan?.day, ramadan?.month_id) && 'current-ramadan'} grid grid-cols-5 gap-[1px] border-b border-primary`"
          >
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ getWeekName(ramadan?.day, ramadan?.month_id) }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ ramadan?.day }} {{ getDayWithMonthName(ramadan?.day, ramadan?.month_id) }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ index + 1 }}</div>
            <div class="text-center py-3 font-medium border-r-2 border-gainsboro">{{ ramadan?.sehri?.end_time }}</div>
            <div class="text-center py-3 font-medium">{{ (ramadan?.iftar ?? ramadan?.magrib)?.start_time }}</div>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
</template>