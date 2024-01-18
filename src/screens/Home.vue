<script>
  import axios from 'axios';
  import { RouterLink } from 'vue-router';
  import Loading from '@/components/Loading.vue';
  import { timeDifferenceHandler } from '@/helpers/index';

  export default {
    components: { 
      Loading 
    },
    data() {
        return {
          time: new Date().toLocaleTimeString( 'en-US', { hour12: true, hour: 'numeric', minute: 'numeric' }),
          loading: false,
          calendar: [],
          timeDifference: '',
        };
    },
    methods: {
      salatTimeHandler(title) {
        switch (title) {
          case 'next':
            this.$router.push({ path: '/time/next-salat' });
          break;
          case 'present':
            this.$router.push({ path: '/time/present-time' });
          break;
          case 'tomorrow':
            this.$router.push({ path: '/time/tomorrow-salat' });
          break;
          default:
            this.$router.push('/');
          break;
      }
    },
    async fetchCalenderData() {
      try {
        this.loading = true;
        axios.get(`${import.meta.env.VITE_BASE_URL}/permanent-calendar`)
        .then((response) => {
          setTimeout(() => {
            this.loading = false;
            this.calendar = response.data?.data?.data;
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
        });
      }
      catch (error) {
          this.loading = false;
          console.error('Error fetching data:', error.message);
      }
    },
    getTimeDifference(time1, time2) {
      return timeDifferenceHandler(time1, time2);
    }
  },
  mounted() {
    this.fetchCalenderData();
  },
};
</script>

<template>
  <!-- <Loading v-if="loading"/> -->
  <!-- v-if="!loading" -->
  <div  class="home-screen p-4">
    <header>
      <div class="header-area mt-5 flex items-center justify-between">
        <p class="font-medium text-base	">Salat Schedule - Bangladesh</p>
        <img src="../assets/images/setting.svg" alt="setting">
      </div>
    </header>
    <!-- Calender Start -->
    <div class="calender mt-6 flex items-center justify-between">
      <div class="date">
        <div class="arabic-date flex items-center gap-3 pb-1">
          <p class="text-base font-medium">8 Jilhazz 1444</p>
          <img class="w-5 h-5" src="../assets/images/up-arrow.svg" alt="up-arrow">
        </div>
        <p class="text-primary text-xs">27 June 2023 | 13 Ashar 1430</p>
      </div>
      <RouterLink to="/loaction" class="location flex items-center gap-2 px-4 py-2 border-2 border-solid border-primary rounded-3xl	">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">Pabna</span>
      </RouterLink>
    </div>
    <!-- Present Salat Start -->
    <div @click="salatTimeHandler('present')" class="present-salat bg-primary my-3 h-36 relative rounded-2xl overflow-auto">
      <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
        <h3 class="pb-3 text-lg font-normal">Present Time</h3>
        <div class="salat flex items-center justify-between">
          <div class="salat-name flex items-center gap-2">
            <div class="dot bg-lightWhite w-6 h-6 rounded-full flex items-center justify-center">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <p class="text-lg font-medium">Esha</p>
          </div>
          <p class="text-lg font-medium">8:22 PM - 12:22 AM</p>
        </div>
        <p class="my-2 text-base font-light">Time left: 3 hours 18 minutes</p>
        <div class="time-slides relative">
          <div class="slide absolute top-0 left-0 w-full h-1 bg-lightWhite rounded-full"></div>
          <div class="slide absolute top-0 left-0 w-2/4 h-1 bg-white rounded-full"></div>
        </div>
      </div>
      <img src="../assets/images/mosque-bg.svg" class="absolute left-0 bottom-0" alt="Mosque Background" >
    </div>
    <!-- Next Salat Start -->
    <div @click="salatTimeHandler('next')" class="next-salat mt-3 px-6 py-4 border border-solid rounded-lg">
      <label class="text-primary text-base pb-2">Next Salat</label>
      <p class="flex items-center justify-between uppercase text-primary">
        <span class="font-bold text-base">Tahajjud</span>
        <span class="font-bold text-base">12:50 am - 03:48 am</span>
      </p>
    </div>

    <!-- Tomorrow Schedule Start -->
    <div @click="salatTimeHandler('tomorrow')" class="tomorrow-schedule bg-primary mt-3 h-28 relative rounded-2xl overflow-auto">
      <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
        <h3 class="pb-3 text-base font-normal text-center">Tomorrow’s Schedule</h3>
        <div class="schedule-contant flex items-center justify-between gap-6">
          <div class="time flex-1">
            <p class="flex items-center justify-between">
              <span class="font-light">Sahri is over</span>
              <span>{{ calendar[1]?.sehri_time }}</span>
            </p>
            <p class="flex items-center justify-between">
              <span class="font-light">Iftal</span>
              <span>{{ calendar[1]?.magrib_and_iftar_time }}</span>
            </p>
          </div>
          <div class="next text-center">
            <p class="text-sm font-light">Next Sahri is after</p>
            <p class="text-sm font-light">6 hours 46 minutes</p>
          </div>
        </div>
      </div>
      <img class="absolute bottom-0 left-0" src="../assets/images/mosque-bg.svg" alt="Mosque Background Red">
    </div>
    <!-- Namaj Option Start -->
    <div class="namaj-options pt-7 grid grid-cols-3 gap-5 gap-y-10">
      <RouterLink to="/salar-schedule" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/mosque.svg" alt="mosque">
        <p class="pt-2 font-light">Salar Schedule</p>
      </RouterLink>
      <RouterLink to="/al-quraan" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/quraan.svg" alt="mosque">
        <p class="pt-2 font-light">Al-Quraan</p>
      </RouterLink>
      <RouterLink to="/sahree-iftar" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/moon.svg" alt="mosque">
        <p class="pt-2 font-light">Sahree - Iftar</p>
      </RouterLink>
      <RouterLink to="/tasbih" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/tasbih.svg" alt="mosque">
        <p class="pt-2 font-light">Tasbih</p>
      </RouterLink>
      <RouterLink to="/kibla-compass" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/teenyicons_compass.svg" alt="mosque">
        <p class="pt-2 font-light">Kibla Compass</p>
      </RouterLink>
      <RouterLink to="/asma-ul-husna" class="option flex flex-col items-center justify-center">
        <img class="w-7 h-7 object-contain object-center" src="../assets/images/icons/asma-ul-husna.png" alt="mosque">
        <p class="pt-2 font-light">Asma-Ul-Husna</p>
      </RouterLink>
    </div>
    <!-- Prohibited Times -->
    <div class="prohibited-times mt-5 px-6 py-6 border border-solid border-primary rounded-lg">
      <h3 class="font-black text-base text-center mb-10">Today's Probable Prohibited Times</h3>
      <div class="times border-b border-cultured">
        <p class="text-sm flex items-center justify-between pb-3">
          <span>Prohibited time (morning)</span>
          <span>5:19 AM - 5:33 AM</span>
        </p>
        <p class="text-sm flex items-center justify-between pb-3">
          <span>Prohibited time (Noon)</span>
          <span>11:52 AM - 12:06 PM</span>
        </p>
        <p class="text-sm flex items-center justify-between pb-3">
          <span>Prohibited time (Evening)</span>
          <span>6:39 PM - 6:53 PM</span>
        </p>
      </div>
    </div>
    <!-- Social Media Start -->
    <div class="social-media mt-3 py-3 px-4 rounded-lg bg-primary flex items-center justify-between gap-3">
      <img class="w-16" src="../assets/images/logo.svg" alt="social-logo">
      <p class="text-xs text-center text-white">Join our Facebook page to give your original feedback about the app.</p>
      <a href="#" class="bg-white px-3 py-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4 text-primary">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  </div>
</template>