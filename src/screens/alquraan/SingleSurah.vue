<script>
  import api from '@/services/api';
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
        currentPage: 1,
        lastPage: 1,
      }
    },
    methods: {
      async fetchData(page) {
        this.loading = true;
        const targetPage = page || parseInt(this.$route.query.page) || 1;

        try {
          const response = await api.get(`/ayat/${parseInt(this.$route?.params?.id)}?page=${targetPage}`);          
          
          const responseData = response.data?.data;
          let newAyats = [];
          
          if (Array.isArray(responseData)) {
            // Fallback for unpaginated API (e.g. if hitting live server)
            newAyats = responseData;
          } else if (responseData?.data) {
            // Paginated API
            newAyats = responseData.data;
          }

          this.ayat = newAyats;
          this.currentPage = responseData?.current_page || 1;
          this.lastPage = responseData?.last_page || 1;

          if (parseInt(this.$route.query.page) !== this.currentPage) {
             this.$router.replace({ query: { ...this.$route.query, page: this.currentPage } });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      changePage(newPage) {
        if (newPage >= 1 && newPage <= this.lastPage) {
          this.fetchData(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div v-if="lastPage > 1" class="flex items-center justify-between mt-6 mb-8">
        <button 
          @click="changePage(currentPage - 1)" 
          class="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <span class="font-bold text-primary">Page {{ currentPage }} of {{ lastPage }}</span>
        <button 
          @click="changePage(currentPage + 1)" 
          class="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="currentPage === lastPage"
        >
          Next
        </button>
      </div>
    </div>
  </template>
</template>