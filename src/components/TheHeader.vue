<script>
  export default {
    props: [
      'title'
    ],
    methods: {
      backHandler(){
        this.$router.go(-1);
      }
    }
  }
</script>

<template>
  <div class="header-area py-6 px-5 flex items-center justify-between">
    <div class="header-left flex items-center gap-6">      
      <button @click="backHandler" class="back-btn">
        <img src="../assets/images/icons/back-arrow.svg" alt="arrow back">
      </button>
      <h3 class="text-base font-bold" >{{ title }}</h3>
    </div>
    <slot></slot>
  </div>
</template>