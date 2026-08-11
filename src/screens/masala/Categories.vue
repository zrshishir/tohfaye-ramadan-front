<script>
  import api, { unwrap } from '@/services/api';
  import { cached, TTL } from '@/services/cache';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: { TheHeader, TheLoading, TheError, TheNoData },
    data() {
      return {
        categories: [],
        loading: false,
        error: false,
        term: '',
      }
    },
    methods: {
      async fetchCategories() {
        this.loading = true;

        try {
          const { value } = await cached('masalaCategories', TTL.masalaCategories, async () =>
            unwrap(await api.get('/masala-categories')));

          this.categories = value;
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

        this.$router.push({ path: '/masala/search', query: { q: term } });
      },
    },
    mounted() {
      this.fetchCategories();
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
    <TheHeader title="Masa-el"/>

    <div class="search-area px-5">
      <form @submit.prevent="submitSearch" class="flex items-center gap-2">
        <input
          v-model="term"
          type="search"
          placeholder="Search masa-el"
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

    <TheNoData v-if="!categories.length"/>

    <div v-else class="categories-area px-5 py-4">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="`/masala/${category.id}`"
        class="category mb-3 p-4 bg-white shadow-3xl rounded-2xl flex items-center justify-between gap-3"
      >
        <div>
          <h3 class="text-lg font-bold">{{ category.name_bn || category.name_en }}</h3>
          <p class="text-sm text-darkGreen">{{ category.name_en }}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-xl">{{ category.name_ar }}</p>
          <p class="text-xs text-darkGreen pt-1">{{ category.masalas_count }}</p>
        </div>
      </RouterLink>
    </div>
  </template>
</template>
