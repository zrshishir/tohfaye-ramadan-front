<script>
  export default {
    data() {
      return {
        location: null,
        storedLocation: localStorage.getItem('location'),
        currentDate: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' }),
        arabicDate: new Date().toLocaleDateString('ar-EG-u-nu-latn',{weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'}),
      };
    },
    methods: {
      getUserLocation() {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          if (this.storedLocation) {
            this.location = JSON.parse(this.storedLocation);
          } else {
            try {
              const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_BASE_KEY}`);
              const data = await response.json();
  
              if (data.results && data.results.length > 0) {
                const city = data.results[0].address_components.find(component => component.types.includes('locality')).long_name;
                const division = data.results[0].address_components.find(component => component.types.includes('administrative_area_level_1')).long_name;
                this.location = { lat: latitude, lng: longitude, city, division };
                localStorage.setItem('location', JSON.stringify(this.location));
              }
            } catch (error) {
              console.error('Error fetching city:', error);
            }            
          }

        });
      },
    },
    mounted() {
      this.getUserLocation();
    }
  }
</script>

<template>
  <header>
    <div class="header-area mt-5 flex items-center justify-between">
      <p class="font-medium text-base	">Prayer Pulse</p>
      <img src="@/assets/images/setting.svg" alt="setting">
    </div>
  </header>
  <!-- Calender Start -->
  <div class="calender my-6 flex items-center justify-between">
    <div class="date">
      <div class="arabic-date flex items-center gap-3 pb-1">
        <p class="text-base font-medium">{{ currentDate }}</p>
        <!-- <p class="text-base font-medium">8 Jilhazz 1444</p> -->
        <!-- <img class="w-5 h-5" src="@/assets/images/up-arrow.svg" alt="up-arrow"> -->
      </div>
      <p class="text-primary text-xs">8 Jilhazz 1444 | 7 Falgun 1430</p>
    </div>
    <div class="location flex items-start gap-2 px-4 py-2 border-2 border-solid border-primary rounded-3xl	">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">{{ location?.city }}</span>
    </div>
  </div>
</template>