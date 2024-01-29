<script>
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Prayer To Wake Up"/>
  <div class="single-surah px-5 pb-3">
    <div class="surah-ayat my-3">
      <div class="ayat-ar p-3">
        <p class="text-3xl text-right">الحمدلله الذي أحيانا بعدما أماتنا و إليه النّشور</p>
      </div>
      <div class="ayat-bn p-3">
        <p class="text-lg leading-8">আলহামদু লিল্লাহিল্লাজি আহইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশুর</p>
      </div>
      <div class="ayat-mn p-3">
        <p class="text-base leading-8">অর্থঃ সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত বানানোর পর জীবিত করেছেন আর তার দিকেই পুনরুত্থান</p>
      </div>
      <div class="ayat-pr p-3">
        <p class="text-base">(বুখারি, হাদিস : ৬৩২৪)।</p>
      </div>
    </div> 
  </div>
</template>