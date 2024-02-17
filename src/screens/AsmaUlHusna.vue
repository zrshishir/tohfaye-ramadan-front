<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
import TheError from '@/components/TheError.vue';

  export default {
    components: {
    TheHeader,
    TheLoading,
    TheError
},
    data(){
      return {
        loading: false,
        error: false,
        asmaulhusna: [],
        storedAsmaUlHusna: localStorage.getItem('Asma-Ul-Husna'),
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        if (this.storedAsmaUlHusna) {
          this.asmaulhusna = JSON.parse(this.storedAsmaUlHusna);
          this.loading = false;
          this.error = false;
        } else {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/asmaul-husna`);
            if (response.statusText === 'OK') {
              this.asmaulhusna = response.data?.data;
              localStorage.setItem('Asma-Ul-Husna', JSON.stringify(response.data?.data));
              this.loading = false;
              this.error = false;
            }
          } catch (error) {
            this.loading = false;
            this.error = true;
            console.error('Error fetching data:', error);
          }
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
  {{ console.log(error)
   }}
  <template v-if="!loading">
    <TheHeader title="Asma-Ul-Husna"/>
    <div class="asmaulhusna-area px-5 py-4">
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