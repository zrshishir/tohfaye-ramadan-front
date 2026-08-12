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
        book: null,
        chapters: [],
        loading: false,
        error: false,
      }
    },
    methods: {
      async fetchChapters() {
        this.loading = true;

        try {
          const payload = unwrap(await api.get(`/hadith-books/${this.$route.params.bookId}/chapters`), {});

          this.book = payload.book ?? null;
          this.chapters = payload.chapters ?? [];
          this.error = false;
        } catch (error) {
          // A 404 means the book does not exist; anything else is a real failure.
          this.chapters = [];
          this.error = error.status !== 404;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.fetchChapters();
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
    <TheHeader :title="book?.name_bn || book?.name_en || 'Hadith'"/>

    <TheNoData v-if="!chapters.length"/>

    <div v-else class="chapters-area px-5 py-4">
      <RouterLink
        v-for="chapter in chapters"
        :key="chapter.id"
        :to="`/hadith/${$route.params.bookId}/${chapter.id}`"
        class="chapter mb-3 p-4 bg-white shadow-3xl rounded-2xl flex items-center gap-4"
      >
        <div class="chapter-no w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {{ chapter.chapter_no }}
        </div>
        <div class="chapter-name flex-1">
          <!-- The dataset ships English chapter names in every edition, so name_bn is
               usually null and English is the honest fallback. -->
          <h3 class="text-base font-bold">{{ chapter.name_bn || chapter.name_en }}</h3>
          <p v-if="chapter.name_ar" class="text-sm pt-1">{{ chapter.name_ar }}</p>
        </div>
        <p class="text-xs text-darkGreen shrink-0">{{ chapter.total_hadiths }}</p>
      </RouterLink>
    </div>
  </template>
</template>
