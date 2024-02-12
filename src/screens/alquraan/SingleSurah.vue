<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';

  export default {
    components: {
      TheHeader,
      TheLoading
    },
    data() {
      return {
        ayat: [],
        loading: false,
        storedAyat: localStorage.getItem('ayat'),
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ayat/${this.$route?.params?.id}`);
          if (response.statusText === 'OK') {
            this.ayat = response.data?.data;
            localStorage.setItem('ayat', JSON.stringify(response.data?.data));
          }
        } catch (error) {
          this.loading = false;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.fetchData();
    }
  }
</script>

<template>
  <the-header title="Al-Fatiha (الفاتحة)">
    <div class="description">
      <span class="text-primary font-semibold">Makki | Verses : 7</span>
    </div>
  </the-header>
  <div class="single-surah px-5 pb-3">
    <div v-for="(data, index) in ayat" :key="index" class="surah-ayat my-3 border border-primary rounded-xl">
      <div class="ayat-ar p-3 border-b border-primary flex items-center justify-between gap-3">
        <span class="w-10 h-12 bg-ayat bg-no-repeat bg-center bg-cover flex items-center justify-center">
          {{ data?.ayat_no <= 9 ? `0${data?.ayat_no}` : data?.ayat_no }}
        </span>
        <p class="text-2xl">{{ data?.arabic_text }}</p>
      </div>
      <div class="ayat-bn p-3 border-b border-primary">
        <p>বিসমিল্লাহির রাহমানির রাহিম</p>
      </div>
      <div class="ayat-mn p-3 border-b border-primary">
        <p>{{ data?.english_text }}</p>
      </div>
      <div class="ayat-mn p-3">
        <p>{{ data?.bangla_text }}</p>
      </div>
    </div> 
  </div>
</template>