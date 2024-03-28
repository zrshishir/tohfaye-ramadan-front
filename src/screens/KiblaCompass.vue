<script>
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';

  export default {
    components: { 
      TheHeader,
      TheLoading,
      TheError
    },
    data(){
      return {
        degree: null,
        error: false,
        loading: false,
        location: JSON.parse(localStorage.getItem('location')),
      }
    },
    methods: {
      getUserKiblaLocation() {
        this.loading = true;
        navigator.geolocation.getCurrentPosition(async (position) => {
          const kaaba = { lat: 21.3891, lon: 39.8579 };
          const { latitude, longitude } = position.coords;

          let dLongitude = kaaba?.lon - longitude;
          let y = Math.sin(dLongitude) * Math.cos(kaaba?.lat);
          let x = Math.cos(latitude) * Math.sin(kaaba?.lat) - Math.sin(latitude) * Math.cos(kaaba?.lat) * Math.cos(dLongitude);
          let bearing = Math.atan2(y, x) * (180 / Math.PI);
          bearing = (bearing + 360) % 360;
          this.degree = bearing.toFixed(2);
          this.loading = false;
          this.error = false;
          console.log("Qibla direction: " + this.degree + "deg");
        }, ( error ) => {
          this.loading = false;
          this.error = true;
          console.error(error);
        });
      }
    },
    mounted() {
      this.getUserKiblaLocation();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20" src="../assets/images/icons/teenyicons_compass.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Tasbih</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading">
    <the-header title="Kibla Compass">
      <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl	">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">{{ location?.city }}</span>
      </div>
    </the-header>
    <div class="compass-area relative flex items-center justify-center h-96 mt-44 px-5">
      <img class="absolute " src="../assets/images/compass.png" alt="Compass">
      <p class="text-xl mt-96 uppercase bg-primary text-white px-10 py-3 rounded-full">Coming Soon</p>
      <!-- <img class="fixed top-[44%] left-[31.5%] rotate-[150deg]" src="../assets/images/compass-kaaba.png" alt="Compass"> -->
    </div>
  </template>
</template>