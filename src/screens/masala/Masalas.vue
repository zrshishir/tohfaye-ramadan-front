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
        masalas: [],
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
        return this.masalas[0]?.category?.name_bn
            || this.masalas[0]?.category?.name_en
            || 'Masa-el';
      },
    },
    methods: {
      async fetchMasalas(page) {
        this.loading = true;

        const params = { page: page || parseInt(this.$route.query.page) || 1 };

        if (this.isSearch) {
          params.q = this.$route.query.q;
        } else {
          params.category_id = this.$route.params.categoryId;
        }

        try {
          const payload = unwrap(await api.get('/masala', { params }), {});

          this.masalas = payload.data ?? [];
          this.currentPage = payload.current_page ?? 1;
          this.lastPage = payload.last_page ?? 1;
          this.total = payload.total ?? 0;
          this.error = false;

          if (parseInt(this.$route.query.page) !== this.currentPage) {
            this.$router.replace({ query: { ...this.$route.query, page: this.currentPage } });
          }
        } catch (error) {
          // 204 is an empty result, 422 a rejected filter — neither is a failure worth
          // showing the error popup for.
          this.masalas = [];
          this.error = ![404, 422].includes(error.status);
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      changePage(page) {
        if (page >= 1 && page <= this.lastPage) {
          this.fetchMasalas(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      preview(masala) {
        const text = masala.answer ?? '';
        return text.length > 160 ? `${text.slice(0, 160)}…` : text;
      },
    },
    mounted() {
      this.fetchMasalas();
    },
    watch: {
      // Searching again from the results screen changes only the query string, so the
      // component is reused and mounted() will not fire again.
      '$route.query.q'(term, previous) {
        if (term !== previous) this.fetchMasalas(1);
      },
    },
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
    <TheHeader :title="title"/>

    <TheNoData v-if="!masalas.length"/>

    <div v-else class="masalas-area px-5 py-4">
      <p class="text-sm text-darkGreen pb-3">{{ total }} masa-el</p>

      <RouterLink
        v-for="masala in masalas"
        :key="masala.id"
        :to="`/masala/detail/${masala.id}`"
        class="masala mb-3 p-4 bg-white shadow-3xl rounded-2xl block"
      >
        <h3 class="text-base font-bold">{{ masala.question }}</h3>
        <p class="text-sm leading-relaxed pt-2 text-darkGreen">{{ preview(masala) }}</p>
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
