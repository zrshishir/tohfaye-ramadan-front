<script>
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Dua Category"/>
  <div class="tasbih-area px-5 pb-3">
    <div class="surahs mt-5">
      <RouterLink :to="`/duas/category-duas/${1}`" class="surah block border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">01</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Salat</p>
          </div>
        </div>
      </RouterLink>
      <RouterLink :to="`/duas/category-duas/${2}`" class="surah block border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">02</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Siam</p>
          </div>
        </div>
      </RouterLink>
      <RouterLink :to="`/duas/category-duas/${3}`" class="surah block border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">03</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Zikir</p>
          </div>
        </div>
      </RouterLink>
      <RouterLink :to="`/duas/category-duas/${4}`" class="surah block border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">04</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Every Day</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>