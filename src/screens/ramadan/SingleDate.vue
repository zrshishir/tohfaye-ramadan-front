<script>
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <the-header title="Ramadan - 1" class="bg-primary text-white">
    <div class="location flex items-start gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">Pabna</span>
    </div>
  </the-header>
  <div class="ramadan-area">
    <div class="ramadan-header text-center text-white bg-primary py-1">
      <div class="bg-ramadan p-6 bg-no-repeat bg-contain bg-center m-5">
        <h1 class="text-2xl font-bold">Ramadan - 2024</h1>
        <p class="pt-1">Sheri and Iftar time alart</p>
      </div>
    </div>
    <div class="ramadan-date px-10 py-7">
      <h2 class="text-6xl font-black text-center">RAMADAN</h2>
      <div class="date py-10 flex items-center justify-between gap-3">
        <div class="text-[150px] bg-primary py-10 px-7 shadow-3xl text-center text-white border border-white rounded-2xl">0</div>
        <div class="text-[150px] bg-primary py-10 px-7 shadow-3xl text-center text-white border border-white rounded-2xl">1</div>
      </div>
      <div class="time flex items-center justify-between gap-3">
        <div class="bg-primary py-10 px-7 shadow-3xl text-center text-white border border-white rounded-2xl">
          <p class="text-3xl font-bold">04:27</p>
          <p class="text-lg pt-1">Sahri</p>
        </div>
        <div class="bg-primary py-10 px-7 shadow-3xl text-center text-white border border-white rounded-2xl">
          <p class="text-3xl font-bold">05:45</p>
          <p class="text-lg pt-1">Iftar</p>
        </div>
      </div>
    </div>
  </div>
</template>