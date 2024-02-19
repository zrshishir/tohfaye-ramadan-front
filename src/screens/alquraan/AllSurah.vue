<script>
  import axios from 'axios';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';

  export default {
    components: {
      TheHeader,
      TheLoading
    },
    data() {
      return {
        surahs: [],
        show: false,
        loading: false,
        selectedSurah: 'all',
        storedSurah: localStorage.getItem('surah'),
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        if (this.storedSurah) {
          this.surahs = JSON.parse(this.storedSurah);
          this.loading = false;
        } else {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sura`);
            if (response.statusText === 'OK') {
              this.surahs = response.data?.data;
              localStorage.setItem('surah', JSON.stringify(response.data?.data));
            }
          } catch (error) {
            this.loading = false;
            console.error('Error fetching data:', error);
          } finally {
            this.loading = false;
          }
        }
      },
      toggleSearch() {
        this.show = !this.show;
      },
      handleSelectSurah() {
        this.surahs = JSON.parse(this.storedSurah);
        
        if (isNaN(this.selectedSurah)) {
          this.surahs = JSON.parse(this.storedSurah);
        }else{
          this.surahs = this.surahs.filter(item => item.id === this.selectedSurah);
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
      <img class="w-20 m-auto" src="../../assets/images/icons/quraan.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Al-Quraan</h1>
    </div>
  </the-loading>
  <template v-if="!loading">
    <the-header title="Al-Quraan">      
      <img @click="toggleSearch" src="@/assets/images/search.svg" alt="search">
    </the-header>
    <div class="tasbih-area px-5 py-3">
      <div v-if="show" class="relative">
        <select v-model="selectedSurah" @change="handleSelectSurah" class="block appearance-none w-full bg-white border border-primary px-4 py-2 pr-8 rounded-xl focus:outline-none focus:shadow-outline">
          <option value="all">Select Your Surah</option>
          <option v-for="(surah, index) in JSON.parse(storedSurah)" :key="index" :value="surah?.id">{{ surah?.name }} ({{ surah?.arabic_name }})</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 12.586l4.293-4.293 1.414 1.414L10 15.414l-5.707-5.707 1.414-1.414z"/>
          </svg>
        </div>
      </div>
      <div class="surahs mt-3">
        <RouterLink v-for="(surah, index) in surahs" :key="index" :to="`/al-quraan/${surah?.id}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
          <div class="content flex items-center gap-3">          
            <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
              <span class="text-white font-bold">{{ surah?.id <= 9 ? `0${surah?.id}` : surah?.id }}</span>
            </div>
            <div class="text-en">
              <p class="text-lg font-bold">{{ surah?.name }} - {{ surah?.ayat_count }}</p>
              <p class="text-sm">আল- ফাতিহা (সূচনা)</p>
            </div>
          </div>
          <div class="text-ar text-right">
            <p class="text-xl font-bold">{{ surah?.arabic_name }}</p>
            <p class="text-sm">{{ surah?.place_of_revelation }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </template>
</template>