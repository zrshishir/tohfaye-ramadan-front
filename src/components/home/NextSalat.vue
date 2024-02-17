<script>
  export default {
    props: [
      'next',
    ],
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/next-salat' });
      }
    }
  }
</script>

<template>
  <div @click="clickHandler()" class="next-salat mt-3 px-4 py-4 border border-solid rounded-lg">
    <label class="text-primary text-base inline-block mb-1">Next Salat</label>
    <p class="flex items-center justify-between uppercase text-primary">
      <span class="font-bold text-base">{{ next?.text_en }} ({{ next?.text_ar }})</span>
      <span class="font-bold text-base">{{ next?.start_time }} - {{ next?.end_time }}</span>
    </p>
  </div>
</template>