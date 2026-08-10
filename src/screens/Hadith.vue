<script>
  import axios from 'axios';
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
    data() {
      return {
        hadiths: [],
        loading: false,
        error: false,
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hadith`);

          // The API answers 204 with an empty body when nothing is published,
          // so response.data is an empty string rather than an envelope.
          this.hadiths = response.status === 204 ? [] : (response.data?.data ?? []);
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
      <img class="w-20 m-auto" src="../assets/images/icons/hadith.svg" alt="Hadith">
      <h1 class="text-2xl font-bold mt-3">Hadith</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading">
    <TheHeader title="Hadith"/>
    <TheNoData v-if="!error && hadiths.length === 0"/>
    <div v-if="hadiths.length" class="hadith-area px-5 py-4">
      <div class="hadith-list grid gap-4">
        <div v-for="hadith in hadiths" :key="hadith.id" class="hadith bg-white shadow-3xl rounded-2xl overflow-hidden">
          <div class="hadith-content p-4">
            <h3 class="text-lg font-bold">{{ hadith.title }}</h3>
            <p class="text-base mt-2 leading-relaxed">{{ hadith.description }}</p>
          </div>
          <div v-if="hadith.reference" class="hadith-reference bg-primary p-3">
            <p class="text-white text-sm text-right">— {{ hadith.reference }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
