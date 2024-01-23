<script>
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Kibla Compass"/>
  <div class="compass-area flex items-center justify-center mt-44 px-5">
    <img class="w-full" src="../assets/images/compass.svg" alt="Compass">
  </div>
</template>