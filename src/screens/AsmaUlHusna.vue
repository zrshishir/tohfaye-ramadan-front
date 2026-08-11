<script>
  import api from '@/services/api';
  import { cached, TTL } from '@/services/cache';
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
        loading: false,
        error: false,
        asmaulhusna: [],

      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const { value } = await cached('asmaulHusna', TTL.asmaulHusna, async () => {
            const response = await api.get('/asmaul-husna');
            return response.data?.data ?? [];
          });
          this.asmaulhusna = value;
          this.error = false;
        } catch (error) {
          this.error = true;
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
      <img class="w-20 m-auto" src="../assets/images/icons/asma-ul-husna.svg" alt="asmaulhusna">
      <h1 class="text-2xl font-bold mt-3">Asma-Ul-Husna</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading">
    <TheHeader title="Asma-Ul-Husna"/>
    <TheNoData v-if="asmaulhusna === 0"/>
    <div v-if="asmaulhusna !== 0" class="asmaulhusna-area px-5 py-4">
      <div class="names-area grid grid-cols-2 gap-3">
        <div v-for="(data, index) in asmaulhusna" :key="index" class="name bg-white shadow-3xl rounded-2xl overflow-auto">
          <div class="name-content pt-4 pb-1 text-center">
            <h3 class="text-3xl">{{ data.arabic_name }}</h3>
            <p class="text-base font-medium py-1">{{ data.english_name }}</p>
          </div>
          <div class="name-bengla bg-primary text-center p-3">
            <p class="text-white">{{ data.bangla_name }}</p>
          </div>
        </div> 
      </div>
    </div>
  </template>
</template>