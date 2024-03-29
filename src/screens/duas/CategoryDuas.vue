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
        filtercategoryDua: [],
        isModalOpen: false,
        selectedOption: 'Select Your Dua',
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
        if (this.selectedOption === 'Select Your Dua') {
          this.filtercategoryDua = this.categoryDuas;
        } else {
          this.filtercategoryDua = this.categoryDuas.filter(dua => dua?.title === this.selectedOption);
        }

        this.isModalOpen = false;
      },
      openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
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
        <button @click="openModal" class="w-full bg-white border border-primary px-4 py-3 pr-8 rounded-xl focus:outline-none focus:shadow-outline">
          <span class="w-full block text-left text-base font-medium">{{ selectedOption }}</span>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 12.586l4.293-4.293 1.414 1.414L10 15.414l-5.707-5.707 1.414-1.414z"/>
            </svg>
          </div>
        </button>
        <!-- Modal Start -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-10">
          <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div class="modal-container bg-white w-11/12 h-5/6 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <!-- Modal content -->
            <div class="modal-content h-full py-4 text-left px-6 flex flex-col">
              <!-- Modal header -->
              <div class="modal-header pb-3">
                <p class="text-xl text-center font-bold">Select Your Dua</p>
              </div>
              <!-- Modal body -->
              <div class="modal-body flex-grow overflow-y-auto pb-3">
                <!-- Modal content goes here -->
                <label class="flex items-center justify-between bg-white border border-primary px-4 py-3 mr-3 mb-3 rounded">
                  <span>All Dua</span>
                  <input type="radio" v-model="selectedOption" @change="handleSelectDua" value="Select Your Dua" class="mr-2">
                </label>
                <label v-for="(dua, index) in JSON.parse(this.storedCategoryDuas) || categoryDuas" :key="index" class="flex items-center justify-between bg-white border border-primary px-4 py-3 mr-3 mb-3 rounded">
                  <span>{{ dua?.title }}</span>
                  <input type="radio" v-model="selectedOption" @change="handleSelectDua" :value="dua?.title" class="mr-2">
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal End -->
      </div>
      
      <div class="surahs mt-3 pb-3">
        <RouterLink v-if="filtercategoryDua.length !== 0" v-for="(dua, index) in filtercategoryDua" :key="index" :to="`/duas/${dua?.id}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 mb-3">
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
        <RouterLink v-if="filtercategoryDua.length === 0" v-for="(dua, index) in categoryDuas" :key="index" :to="`/duas/${dua?.id}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 mb-3">
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