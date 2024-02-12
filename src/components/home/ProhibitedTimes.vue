<script>
  export default {
    props: [
      'prohibited',
    ],
  }
</script>

<template>
  <div class="prohibited-times mt-5 px-6 py-5 border-2 border-solid border-red-600 rounded-lg">
    <h3 class="font-black text-base text-center mb-6">{{ prohibited?.text_en }} ({{ prohibited?.text_ar }})</h3>
    <div class="times border-b border-cultured">
      <p class="text-sm flex items-center justify-between flex-wrap pb-3">
        <span>Morning (সকাল)</span>
        <span>{{ prohibited?.morning_time }}</span>
      </p>
      <p class="text-sm flex items-center justify-between flex-wrap pb-3">
        <span>Noon (দুপুর)</span>
        <span>{{ prohibited?.noon_time }}</span>
      </p>
      <p class="text-sm flex items-center justify-between flex-wrap">
        <span>Evening (সন্ধ্যা)</span>
        <span>{{ prohibited?.evening_time }}</span>
      </p>
    </div>
  </div>
</template>