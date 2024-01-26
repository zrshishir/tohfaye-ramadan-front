<script>
  import TheHeader from '@/components/TheHeader.vue';
  import TheSchedule from '@/components/TheSchedule.vue';

  export default {
    components: {
      TheHeader,
      TheSchedule
    },
    data(){
      return {
        time: [
          {
            "id": 1,
            "month_id": 1,
            "day": "25",
            "fazr": "{\"text_ar\": \"فجر\", \"text_bn\": \"ফজর\", \"text_en\": \"Fazr\", \"end_time\": \"06:08 AM\", \"start_time\": \"05:23 AM\"}",
            "johr": "{\"text_ar\": \"جوهر\", \"text_bn\": \"জোহর\", \"text_en\": \"Johr\", \"end_time\": \"03:00 PM\", \"start_time\": \"12:09 PM\"}",
            "asr": "{\"text_ar\": \"عصر\", \"text_bn\": \"আসর\", \"text_en\": \"Asr\", \"end_time\": \"05:30 PM\", \"start_time\": \"04:01 PM\"}",
            "magrib": "{\"text_ar\": \"مغرب\", \"text_bn\": \"মাগরিব\", \"text_en\": \"Magrib\", \"end_time\": \"06:30 PM\", \"start_time\": \"05:37 PM\"}",
            "esha": "{\"text_ar\": \"عشاء\", \"text_bn\": \"ঈশা\", \"text_en\": \"Esha\", \"end_time\": \"11:10 PM\", \"start_time\": \"06:56 PM\"}",
            "tahazzud": "{\"text_ar\": \"تهجد\", \"text_bn\": \"তাহাজ্জুদ\", \"text_en\": \"Tahazzud\", \"end_time\": \"04:20 AM\", \"start_time\": \"11:30 PM\"}",
            "sehri": "{\"text_ar\": \"سحري\", \"text_bn\": \"সেহরী\", \"text_en\": \"Sehri\", \"end_time\": \"03:16 AM\", \"start_time\": \"04:16 AM\"}",
            "sunrise": "{\"text_ar\": \"شروق الشمس\", \"text_bn\": \"সূর্যোদয়\", \"text_en\": \"Sunrise\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
            "ishraq": "{\"text_ar\": \"إشراق\", \"text_bn\": \"ইশরাক\", \"text_en\": \"Ishraq\", \"end_time\": \"06:30 PM\", \"start_time\": \"11:00 PM\"}",
            "forbidden": "{\"text_ar\": \"وقت محظور\", \"text_bn\": \"নিষিদ্ধ সময়\", \"text_en\": \"Forbidden\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
            "created_at": null,
            "updated_at": null
          },
        ],
      }
    }
  }
</script>

<template>
  <the-header title="Today Schedule">
    <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl	">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">Pabna</span>
    </div>
  </the-header>
  <TheSchedule :times="time[0]" />
</template>