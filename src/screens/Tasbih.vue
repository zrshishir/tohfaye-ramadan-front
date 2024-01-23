<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';

  export default {
    components: {
    TheHeader,
    TheLoading
  },
    data(){
      return {
        loading: false,
        tasbihs: null,
      }
    },
    methods: {
      async fetchTasbihs() {
        this.loading = true;
        axios.get(`${import.meta.env.VITE_BASE_URL}/tasbih`)
        .then(response => {
          setTimeout(() => {
            this.loading = false;
            this.tasbihs = JSON.parse(response?.data?.data?.tasbih);
          }, 1000);
        })
        .catch(error => {
          this.loading = false;
          console.error('Error fetching data:', error);
        });
      }
    },
    created() {
      this.fetchTasbihs();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20" src="../assets/images/icons/tasbih.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Tasbih</h1>
    </div>
  </the-loading>
  <template v-if="!loading">    
    <TheHeader title="Tasbih"/>
    <div class="tasbih-area px-5 py-4">
      <div v-for="(tasbih, index) in tasbihs" :key="index" class="tasbih mb-3 p-3 border-2 border-primary rounded-3xl flex items-center justify-between gap-3 bg-tasbih bg-cover bg-center bg-no-repeat">
        <div class="tasbih-content flex-1 text-center">
          <h3 class="text-3xl">{{ tasbih.text_ar }}</h3>
          <p class="text-base py-1">{{ tasbih.text_en }}</p>
          <p>{{ tasbih.text_bn }}</p>
          <div class="counts mt-2 grid grid-cols-3 gap-1 text-sm">
            <div class="count">
              <p>Today</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
            <div class="count">
              <p>Monthly</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
            <div class="count">
              <p>Yearly</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
          </div>
        </div>
        <div class="tasbih-right p-1">
          <div class="right-btn"></div>
          <div class="right-count text-primary">
            <h3 class="text-lg"><span class="text-4xl">{{ tasbih.count }}</span>/{{ tasbih.reset_on }}</h3>
            <p class="text-xs">Sub Total: 0</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>