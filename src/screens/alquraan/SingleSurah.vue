<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: {
      TheHeader,
      TheLoading,
      TheNoData
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
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ayat/${parseInt(this.$route?.params?.id)}`);          
          this.ayat = response.data?.data;
          localStorage.setItem('ayat', JSON.stringify(response.data?.data));          
          this.loading = false;
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
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="@/assets/images/icons/quraan.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Al-Quraan</h1>
    </div>
  </the-loading>
  <template v-if="!loading">
    <the-header :title="`${$route?.params?.name} (${$route?.params?.nameArabic})`">
      <div class="description">
        <span class="text-primary font-semibold">{{$route?.params?.type}} | Verses : {{$route?.params?.ayatCount}}</span>
      </div>
    </the-header>
    <TheNoData v-if="ayat.length === 0"/>
    <div v-if="ayat.length !== 0" class="single-surah px-5 pb-3">
      <div v-for="(data, index) in ayat" :key="index" class="surah-ayat my-3 border border-primary rounded-xl">
        <div class="ayat-ar p-3 border-b border-primary flex items-center justify-between gap-3">
          <span class="w-10 h-12 bg-ayat bg-no-repeat bg-center bg-cover flex items-center justify-center">
            {{ data?.ayat_no <= 9 ? `0${data?.ayat_no}` : data?.ayat_no }}
          </span>
          <p class="text-2xl w-fit text-right">{{ data?.arabic_text }}</p>
        </div>
        <div class="ayat-bn p-3 border-b border-primary">
          <p>{{ data?.bangla_text }}</p>
        </div>
        <div class="ayat-mn p-3 border-b border-primary">
          <p>{{ data?.english_text }}</p>
        </div>
        <div class="ayat-mn p-3">
          <p>{{ data?.meaning }}</p>
        </div>
      </div> 
    </div>
  </template>
</template>