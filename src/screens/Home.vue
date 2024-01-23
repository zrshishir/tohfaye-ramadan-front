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

  // new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' })
  // new Date().toLocaleTimeString( 'en-US', { timeZone: 'Asia/Dhaka', hour12: true, hour: 'numeric', minute: 'numeric' })

  export default {
    components: {
      Loading,
      HeaderArea,
      MenuOption,
      PresentSalat,
      NextSalat,
      TomorrowSchedule,
      ProhibitedTimes,
      SocialMedia,
      Loading
    },
    data() {
      return {
        calendar: [],
        loading: false,
        currentTime: new Date().getTime(),
        storedData: localStorage.getItem('calendarData'),
        storedTimestamp: localStorage.getItem('calendarTimestamp'),
      };
    },
    methods: {      
      async fetchCalenderData() {
        this.loading = true;
        
        if (this.storedData && this.storedTimestamp && (this.currentTime - parseInt(this.storedTimestamp) < 24 * 60 * 60 * 1000)) {
          this.calendar = JSON.parse(this.storedData);
          this.loading = false;
        } else {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/permanent-calendar`);
            this.calendar = response.data?.data?.permanent_calendars;
            
            localStorage.setItem('calendarData', JSON.stringify(this.calendar));
            localStorage.setItem('calendarTimestamp', this.currentTime.toString());
          } catch (error) {
            this.loading = false;
            console.error('Error fetching data:', error);
          } finally {
            this.loading = false;
          }
        }
      }
    },   
    mounted() {
      this.fetchCalenderData();
    },
  };
</script>

<template>
  <Loading v-if="loading" />
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