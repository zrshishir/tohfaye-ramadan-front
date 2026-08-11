<script>
  import api from '@/services/api';
  import { calendarParams } from '@/services/settings';
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
        ramadanSingleCalender: [],
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
          const response = await api.get('/ramazan-calendar', { params: calendarParams() });
          const result = response.data?.data?.permanent_calendars;
          const filterData = result.filter(data => data?.id === parseInt(this.$route?.params?.id));

          const index = result.indexOf(filterData[0]) + 1;
          const formattedIndex = index <= 9 ? `0${index}` : `${index}`;

          this.ramadanSingleCalender = { 
            index: formattedIndex, 
            data: filterData[0] 
          };

          this.loading = false;
          this.error = false;           
        } catch (error) {
          this.loading = false;
          this.error = true;
          console.error('Error fetching data:', error);
        }
        
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
    <the-header :title="`Ramadan - ${ramadanSingleCalender?.index}`" class="bg-primary text-white">
      <div class="location flex items-start gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">{{ location?.city }}</span>
      </div>
    </the-header>
    <TheNoData v-if="ramadanSingleCalender === 0"/>
    <div v-if="ramadanSingleCalender !== 0" class="ramadan-area">
      <div class="ramadan-header text-center text-white bg-primary py-1">
        <div class="p-6 m-5">
          <h1 class="text-2xl font-bold">Ramadan - {{ calendarYear }}</h1>
          <p class="pt-1">Sheri and Iftar time alart</p>
        </div>
      </div>
      <div class="ramadan-date px-10 py-7">
        <h2 class="text-6xl font-black text-center">RAMADAN</h2>
        <div class="date py-8 flex items-center justify-between gap-3">
          <div class="text-[150px] bg-primary p-7 shadow-3xl text-center text-white border border-white rounded-2xl">
            {{ ramadanSingleCalender?.index && ramadanSingleCalender?.index[0] }}
          </div>
          <div class="text-[150px] bg-primary p-7 shadow-3xl text-center text-white border border-white rounded-2xl">
            {{ ramadanSingleCalender?.index && ramadanSingleCalender?.index[1] }}
          </div>
        </div>
        <div class="time flex items-center justify-between gap-3">
          <div class="bg-primary w-full py-7 shadow-3xl text-center text-white border border-white rounded-2xl">
            <p class="text-xl font-bold">{{ ramadanSingleCalender?.data?.sehri?.end_time }}</p>
            <p class="text-lg pt-1">Sahri</p>
          </div>
          <div class="bg-primary w-full py-7 shadow-3xl text-center text-white border border-white rounded-2xl">
            <p class="text-xl font-bold">{{ (ramadanSingleCalender?.data?.iftar ?? ramadanSingleCalender?.data?.magrib)?.start_time }}</p>
            <p class="text-lg pt-1">Iftar</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>