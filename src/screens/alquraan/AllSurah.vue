<script>
  import api from '@/services/api';
  import { cached, TTL } from '@/services/cache';
  import { RouterLink } from 'vue-router';
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
        surahs: [],
        filterSurah: [],
        show: false,
        loading: false,
        isModalOpen: false,
        selectedOption: 'Select Your Surah',

      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const { value } = await cached('suras', TTL.suras, async () => {
            const response = await api.get('/sura');
            return response.data?.data ?? [];
          });
          this.surahs = value;
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      toggleSearch() {
        this.show = !this.show;
      },
      handleSelectSurah() {
        if (this.selectedOption === 'Select Your Surah') {
          this.filterSurah = this.surahs;
        } else {
          this.filterSurah = this.surahs.filter(surah => surah.name === this.selectedOption);
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
      <img class="w-20 m-auto" src="../../assets/images/icons/quraan.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Al-Quraan</h1>
    </div>
  </the-loading>
  <template v-if="!loading">
    <the-header title="Al-Quraan">      
      <img @click="toggleSearch" class="w-[22px]" src="@/assets/images/search.svg" alt="search">
    </the-header>
    <TheNoData v-if="surahs === 0"/>
    <div v-if="surahs !== 0" class="tasbih-area px-5 pb-3">
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
                <p class="text-xl text-center font-bold">Select Your Surah</p>
              </div>
              <!-- Modal body -->
              <div class="modal-body flex-grow overflow-y-auto pb-3">
                <!-- Modal content goes here -->
                <label class="flex items-center justify-between bg-white border border-primary px-4 py-3 mr-3 mb-3 rounded">
                  <span>All Surah</span>
                  <input type="radio" v-model="selectedOption" @change="handleSelectSurah" value="Select Your Surah" class="mr-2">
                </label>
                <label v-for="(surah, index) in JSON.parse(this.storedSurah) || surahs" :key="index" class="flex items-center justify-between bg-white border border-primary px-4 py-3 mr-3 mb-3 rounded">
                  <span>{{ surah?.name }}</span>
                  <input type="radio" v-model="selectedOption" @change="handleSelectSurah" :value="surah?.name" class="mr-2">
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal End -->
      </div>
      <div class="surahs mt-3">
         <RouterLink 
          v-if="filterSurah.length !== 0"
          v-for="(surah, index) in filterSurah" 
          :key="index" 
          :to="`/al-quraan/${surah?.name}/${surah?.arabic_name}/${surah?.type}/${surah?.ayat_count}/${surah?.id}`" 
          class="surah flex items-center justify-between border border-primary rounded-xl p-3 mb-3"
        >
          <div class="content flex items-center gap-3">          
            <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
              <span class="text-white font-bold">{{ surah?.id <= 9 ? `0${surah?.id}` : surah?.id }}</span>
            </div>
            <div class="text-en">
              <p class="text-lg font-bold">{{ surah?.name }} - {{ surah?.ayat_count }}</p>
              <p class="text-sm">{{ surah?.bangla_text }} ({{ surah?.meaning }})</p>
            </div>
          </div>
          <div class="text-ar text-right">
            <p class="text-xl font-bold">{{ surah?.arabic_name }}</p>
            <p class="text-sm">{{ surah?.place_of_revelation }}</p>
          </div>
        </RouterLink>
        <RouterLink 
          v-if="filterSurah.length === 0"
          v-for="(surah, index) in surahs" 
          :key="index" 
          :to="`/al-quraan/${surah?.name}/${surah?.arabic_name}/${surah?.type}/${surah?.ayat_count}/${surah?.id}`" 
          class="surah flex items-center justify-between border border-primary rounded-xl p-3 mb-3"
        >
          <div class="content flex items-center gap-3">          
            <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
              <span class="text-white font-bold">{{ surah?.id <= 9 ? `0${surah?.id}` : surah?.id }}</span>
            </div>
            <div class="text-en">
              <p class="text-lg font-bold">{{ surah?.name }} - {{ surah?.ayat_count }}</p>
              <p class="text-sm">{{ surah?.bangla_text }} ({{ surah?.meaning }})</p>
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