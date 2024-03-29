<script>
  export default {
    props: [
      'title'
    ],
    methods: {
      backHandler(){
        this.$route.path === '/time/upcoming-time' ? this.$router.go(-2) : this.$router.go(-1);
      }
    }
  }
</script>

<template>
  <div class="header-area py-6 px-5 flex items-center justify-between">
    <div class="header-left flex items-center gap-5">      
      <button @click="backHandler" class="back-btn">
        <img v-if="!$route.path.startsWith('/ramadan')" class="w-[18px]" src="../assets/images/icons/back-arrow.svg" alt="arrow back">
        <img v-if="$route.path.startsWith('/ramadan')" class="w-[18px]" src="../assets/images/arrow-w.svg" alt="arrow white">
      </button>
      <h3 class="text-lg capitalize font-bold" >{{ title }}</h3>
    </div>
    <slot></slot>
  </div>
</template>