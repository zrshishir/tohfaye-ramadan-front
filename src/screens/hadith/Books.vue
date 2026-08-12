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
        books: [],
        loading: false,
        error: false,
        term: '',
      }
    },
    methods: {
      async fetchBooks() {
        this.loading = true;

        try {
          this.books = unwrap(await api.get('/hadith-books'));
          this.error = false;
        } catch (error) {
          this.error = true;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      submitSearch() {
        const term = this.term.trim();

        // The API rejects anything shorter than two characters.
        if (term.length < 2) return;

        this.$router.push({ path: '/hadith/search', query: { q: term } });
      },
    },
    mounted() {
      this.fetchBooks();
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
    <TheHeader title="Hadith"/>

    <div class="search-area px-5">
      <form @submit.prevent="submitSearch" class="flex items-center gap-2">
        <input
          v-model="term"
          type="search"
          placeholder="Search hadith (Bangla or English)"
          class="flex-1 px-4 py-2 border-2 border-primary rounded-3xl outline-none"
        >
        <button
          type="submit"
          class="bg-primary text-white px-5 py-2 rounded-3xl font-semibold disabled:opacity-50"
          :disabled="term.trim().length < 2"
        >
          Search
        </button>
      </form>
    </div>

    <TheNoData v-if="!books.length"/>

    <div v-else class="books-area px-5 py-4">
      <RouterLink
        v-for="book in books"
        :key="book.id"
        :to="`/hadith/${book.id}`"
        class="book mb-3 p-4 bg-white shadow-3xl rounded-2xl flex items-center justify-between gap-3"
      >
        <div class="book-name">
          <h3 class="text-lg font-bold">{{ book.name_bn || book.name_en }}</h3>
          <p class="text-sm text-darkGreen">{{ book.name_en }}</p>
          <p v-if="book.author" class="text-xs pt-1">{{ book.author }}</p>
        </div>
        <div class="book-meta text-right shrink-0">
          <p class="text-2xl">{{ book.name_ar }}</p>
          <p class="text-xs text-darkGreen pt-1">{{ book.total_hadiths }} hadith</p>
        </div>
      </RouterLink>
    </div>
  </template>
</template>
