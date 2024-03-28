<script>
  import axios from 'axios';
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
        show: false,
        error: false,
        loading: false,
        categoryDuas: [],
        selectedDua: 'all',
        storedCategoryDuas: localStorage.getItem('Category-Duas'),
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/doa/${this.$route?.params?.id || 1}`);
          localStorage.setItem('Category-Duas', JSON.stringify(response.data?.data));
          this.categoryDuas = response.data?.data;
          this.loading = false;
          this.error = false;           
        } catch (error) {
          this.loading = false;
          this.error = true;
          console.error('Error fetching data:', error);
        }
      },
      toggleSearch() {
        this.show = !this.show;
      },
      handleSelectDua() {
        this.categoryDuas = JSON.parse(this.storedCategoryDuas);

        if (this.selectedDua === 'all') {
          this.categoryDuas = JSON.parse(this.storedCategoryDuas);
        } else {
          this.categoryDuas = JSON.parse(this.storedCategoryDuas).filter(dua => dua?.id === this.selectedDua);
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
      <img class="w-20 m-auto" src="@/assets/images/icons/dua.svg" alt="Dua-Category">
      <h1 class="text-2xl font-bold mt-3">Duas</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading">
    <the-header :title="`${$route?.params?.title} Duas`">      
      <img @click="toggleSearch" class="w-[22px]" src="@/assets/images/search.svg" alt="search">
    </the-header>
    <TheNoData v-if="categoryDuas.length === 0"/>
    <div v-if="categoryDuas.length !== 0" class="tasbih-area px-5">
      <div v-if="show" class="relative">
        <select v-model="selectedDua" @change="handleSelectDua" class="block appearance-none w-full bg-white border border-primary px-4 py-2 pr-8 rounded-full focus:outline-none focus:shadow-outline">
          <option value="all">Select Your Dua</option>
          <option v-for="(dua, index) in JSON.parse(this.storedCategoryDuas) || categoryDuas" :key="index" :value="dua?.id">
            {{ dua?.title }} ({{ dua?.notes }})
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 12.586l4.293-4.293 1.414 1.414L10 15.414l-5.707-5.707 1.414-1.414z"/>
          </svg>
        </div>
      </div>
      <div class="surahs mt-3 pb-3">
        <RouterLink v-for="(dua, index) in categoryDuas" :key="index" :to="`/duas/${dua?.id}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 mb-3">
          <div class="content flex items-center gap-3">          
            <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
              <span class="text-white font-bold">{{ dua?.id }}</span>
            </div>
            <div class="text-en">
              <p class="text-base font-bold pb-1">{{ dua?.title }}</p>
              <p class="text-sm">{{ dua?.reference }}</p>
            </div>
          </div>
        </RouterLink>      
      </div>
    </div>
  </template>
</template>