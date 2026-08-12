<script>
  import api, { unwrap } from '@/services/api';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: { TheHeader, TheLoading, TheError, TheNoData },
    data() {
      return {
        hadiths: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
        error: false,
      }
    },
    computed: {
      isSearch() {
        return this.$route.path.endsWith('/search');
      },
      title() {
        if (this.isSearch) return `Search: ${this.$route.query.q ?? ''}`;
        return this.hadiths[0]?.chapter?.name_bn
            || this.hadiths[0]?.chapter?.name_en
            || 'Hadith';
      },
    },
    methods: {
      async fetchHadiths(page) {
        this.loading = true;

        const target = page || parseInt(this.$route.query.page) || 1;
        const params = { page: target };

        if (this.isSearch) {
          params.q = this.$route.query.q;
        } else {
          params.book_id = this.$route.params.bookId;
          params.chapter_id = this.$route.params.chapterId;
        }

        try {
          const payload = unwrap(await api.get('/hadith', { params }), {});

          this.hadiths = payload.data ?? [];
          this.currentPage = payload.current_page ?? 1;
          this.lastPage = payload.last_page ?? 1;
          this.total = payload.total ?? 0;
          this.error = false;

          if (parseInt(this.$route.query.page) !== this.currentPage) {
            this.$router.replace({ query: { ...this.$route.query, page: this.currentPage } });
          }
        } catch (error) {
          // 204 arrives as an empty body, not an error; a 422 means the filter or search
          // term was rejected. Neither should show the failure popup.
          this.hadiths = [];
          this.error = ![404, 422].includes(error.status);
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      changePage(page) {
        if (page >= 1 && page <= this.lastPage) {
          this.fetchHadiths(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      preview(hadith) {
        const text = hadith.bangla_text || hadith.english_text || hadith.arabic_text || '';
        return text.length > 220 ? `${text.slice(0, 220)}…` : text;
      },
    },
    mounted() {
      this.fetchHadiths();
    },
    watch: {
      // Searching again from the results screen changes only the query string,
      // so the component is reused and mounted() will not fire again.
      '$route.query.q'(term, previous) {
        if (term !== previous) this.fetchHadiths(1);
      },
    },
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
    <TheHeader :title="title"/>

    <TheNoData v-if="!hadiths.length"/>

    <div v-else class="hadiths-area px-5 py-4">
      <p class="text-sm text-darkGreen pb-3">{{ total }} hadith</p>

      <RouterLink
        v-for="hadith in hadiths"
        :key="hadith.id"
        :to="`/hadith/detail/${hadith.id}`"
        class="hadith mb-3 p-4 bg-white shadow-3xl rounded-2xl block"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-xs font-bold text-primary">
            {{ hadith.book?.name_bn || hadith.book?.name_en }} · {{ hadith.hadith_number }}
          </p>
          <p v-if="hadith.grade" class="text-xs text-darkGreen shrink-0">{{ hadith.grade }}</p>
        </div>
        <p class="text-base leading-relaxed pt-2">{{ preview(hadith) }}</p>
      </RouterLink>

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
