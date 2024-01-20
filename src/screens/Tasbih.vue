<script>
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Tasbih"/>
  <div class="tasbih-area px-5 py-4">
    <div class="tasbih p-3 border-2 border-primary rounded-3xl flex items-center justify-between gap-3 bg-tasbih bg-cover bg-center bg-no-repeat">
      <div class="tasbih-content flex-1 text-center">
        <h3 class="text-3xl">ٱلْحَمْدُ لِلّٰهِ</h3>
        <p class="text-base py-1">Suboha-nallah</p>
        <p>সকল প্রশংসা মহান আল্লাহর জন্য</p>
        <div class="counts mt-2 grid grid-cols-2 gap-1 text-xs">
          <p>Today Count: 00</p>
          <p>Monthly Count: 00</p>
          <p>Yearly Count: 00</p>
          <p>Total Count: 00</p>
        </div>
      </div>
      <div class="tasbih-right p-1">
        <div class="right-btn"></div>
        <div class="right-count text-primary">
          <h3 class="text-lg"><span class="text-4xl">12</span>/33</h3>
          <p class="text-xs">Sub Total: 12</p>
        </div>
      </div>
    </div>
  </div>
</template>