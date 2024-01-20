<script>
  export default {
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/next-salat' });
      }
    }
  }
</script>

<template>
  <div @click="salatTimeHandler('next')" class="next-salat mt-3 px-6 py-4 border border-solid rounded-lg">
    <label class="text-primary text-base pb-2">Next Salat</label>
    <p class="flex items-center justify-between uppercase text-primary">
      <span class="font-bold text-base">Tahajjud</span>
      <span class="font-bold text-base">12:50 am - 03:48 am</span>
    </p>
  </div>
</template>