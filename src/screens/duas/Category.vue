<script>
  import api from '@/services/api';
  import { cached, TTL } from '@/services/cache';
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';

  export default {
    components: { 
      TheHeader,
      TheLoading,
      TheError,
    },
    data(){
      return {
        error: false,
        loading: false,
        duaCategory: [],

      }
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          const { value } = await cached('duaCategories', TTL.duaCategories, async () => {
            const response = await api.get('/doa-category');
            return response.data?.data ?? [];
          });
          this.duaCategory = value;
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
      <img class="w-20 m-auto" src="@/assets/images/icons/dua.svg" alt="Dua-Category">
      <h1 class="text-2xl font-bold mt-3">Dua Category</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading"> 
    <TheHeader title="Dua Category"/>
    <div class="tasbih-area px-5 pb-3">
      <div class="surahs mt-5">
        <RouterLink 
          v-for="(dua, index) in duaCategory" 
          :key="index" 
          :to="`/duas/category-duas/${dua?.name.toLowerCase()}/${dua?.id}`" 
          class="surah block border border-primary rounded-xl p-3 mb-3"
        >
          <div class="content flex items-center gap-4">          
            <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
              <span class="text-white font-bold">{{ dua?.id }}</span>
            </div>
            <div class="text-en">
              <p class="text-xl font-bold pb-1">{{ dua?.name }}</p>
              <p class="text-sm">{{dua?.bangla_text}} ({{ dua?.arabic_text }})</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </template>
</template>