<script>
  import api, { unwrap } from '@/services/api';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: { TheHeader, TheLoading, TheError, TheNoData },
    data() {
      return {
        masala: null,
        loading: false,
        error: false,
      }
    },
    methods: {
      async fetchMasala() {
        this.loading = true;

        try {
          this.masala = unwrap(await api.get(`/masala/${this.$route.params.id}`), null);
          this.error = false;
        } catch (error) {
          this.masala = null;
          this.error = error.status !== 404;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.fetchMasala();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="../../assets/images/icons/masala.svg" alt="Masa-el">
      <h1 class="text-2xl font-bold mt-3">Masa-el</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading && !error">
    <TheHeader :title="masala?.category?.name_bn || masala?.category?.name_en || 'Masa-el'"/>

    <TheNoData v-if="!masala"/>

    <div v-else class="masala-area px-5 py-4">
      <div class="question bg-primary rounded-2xl p-4 mb-3">
        <p class="text-xs text-white opacity-90 pb-1">প্রশ্ন</p>
        <h2 class="text-lg font-bold text-white">{{ masala.question }}</h2>
      </div>

      <div class="answer bg-white shadow-3xl rounded-2xl p-4 mb-3">
        <p class="text-xs text-darkGreen pb-2 font-bold">উত্তর</p>
        <p class="text-base leading-relaxed whitespace-pre-line">{{ masala.answer }}</p>
      </div>

      <div v-if="masala.reference" class="reference bg-white shadow-3xl rounded-2xl p-4 mb-8">
        <p class="text-sm text-darkGreen">সূত্র: {{ masala.reference }}</p>
      </div>
    </div>
  </template>
</template>
