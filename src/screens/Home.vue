<script>
  import axios from 'axios';
  import Loading from '@/components/Loading.vue';
  import NextSalat from '@/components/home/NextSalat.vue';
  import HeaderArea from '@/components/home/HeaderArea.vue';
  import MenuOption from '@/components/home/MenuOption.vue';
  import SocialMedia from '@/components/home/SocialMedia.vue';
  import PresentSalat from '@/components/home/PresentSalat.vue';
  import TomorrowSchedule from '@/components/home/TomorrowSchedule.vue';
  import ProhibitedTimes from '@/components/home/ProhibitedTimes.vue';

  export default {
    components: {
      Loading,
      HeaderArea,
      MenuOption,
      PresentSalat,
      NextSalat,
      TomorrowSchedule,
      ProhibitedTimes,
      SocialMedia
    },
    data() {
      return {
        calendar: [],
        loading: false,
        time: new Date().toLocaleTimeString( 'en-US', { timeZone: 'Asia/Dhaka', hour12: true, hour: 'numeric', minute: 'numeric' }),
        currentDate: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' }),
      };
    },
    methods: {      
      async fetchCalenderData() {
        this.loading = true;
        axios.get(`${import.meta.env.VITE_BASE_URL}/permanent-calendar`)
        .then((response) => {
          setTimeout(() => {
            this.loading = false;
            this.calendar = response.data?.data?.permanent_calendars;
          }, 1000);
        })
        .catch((error) => {
          this.loading = false;
          console.error('Error fetching data:', error);
        });      
      }
    },  
    mounted() {
      this.fetchCalenderData();
    },
  };
</script>

<template>
  <Loading v-if="loading"/>
  <div v-if="!loading" class="home-screen p-4">
    <HeaderArea/>
    <PresentSalat/>
    <NextSalat/>
    <TomorrowSchedule/>
    <MenuOption/>
    <ProhibitedTimes/>
    <SocialMedia/>
  </div>
</template>