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
        hadith: null,
        loading: false,
        error: false,
      }
    },
    methods: {
      async fetchHadith() {
        this.loading = true;

        try {
          this.hadith = unwrap(await api.get(`/hadith/${this.$route.params.id}`), null);
          this.error = false;
        } catch (error) {
          this.hadith = null;
          this.error = error.status !== 404;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.fetchHadith();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="../../assets/images/icons/hadith.svg" alt="Hadith">
      <h1 class="text-2xl font-bold mt-3">Hadith</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading && !error">
    <TheHeader :title="hadith?.book?.name_bn || hadith?.book?.name_en || 'Hadith'"/>

    <TheNoData v-if="!hadith"/>

    <div v-else class="hadith-area px-5 py-4">
      <div class="hadith-meta pb-4">
        <p class="text-sm text-primary font-bold">
          {{ hadith.book?.name_en }} · Hadith {{ hadith.hadith_number }}
        </p>
        <p v-if="hadith.chapter" class="text-xs text-darkGreen pt-1">
          Chapter {{ hadith.chapter.chapter_no }} — {{ hadith.chapter.name_bn || hadith.chapter.name_en }}
        </p>
      </div>

      <div v-if="hadith.arabic_text" class="arabic bg-white shadow-3xl rounded-2xl p-4 mb-3">
        <p class="text-2xl leading-loose text-right" dir="rtl">{{ hadith.arabic_text }}</p>
      </div>

      <div v-if="hadith.bangla_text" class="bangla bg-white shadow-3xl rounded-2xl p-4 mb-3">
        <p class="text-xs text-darkGreen pb-2 font-bold">বাংলা</p>
        <p class="text-base leading-relaxed">{{ hadith.bangla_text }}</p>
      </div>

      <div v-if="hadith.english_text" class="english bg-white shadow-3xl rounded-2xl p-4 mb-3">
        <p class="text-xs text-darkGreen pb-2 font-bold">English</p>
        <p class="text-base leading-relaxed">{{ hadith.english_text }}</p>
      </div>

      <div class="footer bg-primary rounded-2xl p-4 mb-8">
        <p class="text-white text-sm">{{ hadith.reference }}</p>
        <p v-if="hadith.grade" class="text-white text-xs pt-1 opacity-90">Grade: {{ hadith.grade }}</p>
      </div>
    </div>
  </template>
</template>
