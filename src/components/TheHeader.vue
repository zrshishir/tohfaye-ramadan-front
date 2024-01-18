<script>
  export default {
    props: [
      'title'
    ]
  }
</script>

<template>
  <div class="header-area py-6 px-5 flex items-center justify-between">
    <div class="header-left flex items-center gap-6">      
      <button class="back-btn">
        <img src="../assets/images/icons/back-arrow.svg" alt="arrow back">
      </button>
      <h3 class="text-lg font-bold" >{{ title }}</h3>
    </div>
  </div>
</template>