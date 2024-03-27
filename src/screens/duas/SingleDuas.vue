<script>
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';

  export default {
    components: { 
      TheHeader,
      TheLoading
    },
    data(){
      return {
        loading: false,
        singleDua: [],
        storedCategoryDuas: localStorage.getItem('Category-Duas'),
      }
    },
    methods: {
      async fetchData() {
        this.singleDua = JSON.parse(this.storedCategoryDuas).filter(dua => dua?.id === parseInt(this.$route?.params?.id))[0];
      }
    },
    mounted() {
      this.fetchData();
    }
  }
</script>

<template>
  <TheHeader :title="this.singleDua?.title"/>
  <div class="single-surah px-5 pb-3">
    <div class="surah-ayat my-3 border border-primary rounded-xl">
      <div class="ayat-ar p-3 border-b border-primary flex items-center justify-end gap-3">
        <p class="text-3xl text-right leading-10">{{ this.singleDua?.arabic_text }}</p>
      </div>
      <div class="ayat-bn p-3 border-b border-primary">
        <p class="text-justify leading-8"> <strong>বাংলা:</strong> {{ this.singleDua?.bangla_text }}</p>
      </div>
      <div class="ayat-mn p-3 border-b border-primary">
        <p class="text-base text-justify leading-8"><strong>অর্থ:</strong> {{ this.singleDua?.meaning }}</p>
      </div>
      <div class="ayat-mn p-3 border-b border-primary">
        <p class="text-base text-justify leading-8"><strong>কোথায় ব্যবহার করবো:</strong> {{ this.singleDua?.when_to_use }}</p>
      </div>
      <div class="ayat-mn p-3">
        <p class="text-base">{{ this.singleDua?.reference }}</p>
      </div>
    </div> 
  </div>
</template>