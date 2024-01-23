<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';

  const time = {
    "id": 1,
    "month_id": 1,
    "day": "23",
    "fazr": "{\"text_ar\": \"فجر\", \"text_bn\": \"ফজর\", \"text_en\": \"Fazr\", \"end_time\": \"11:59 AM\", \"start_time\": \"05:23 AM\"}",
    "johr": "{\"text_ar\": \"جوهر\", \"text_bn\": \"জোহর\", \"text_en\": \"Johr\", \"end_time\": \"03:00 PM\", \"start_time\": \"12:09 PM\"}",
    "asr": "{\"text_ar\": \"عصر\", \"text_bn\": \"আসর\", \"text_en\": \"Asr\", \"end_time\": \"05:30 PM\", \"start_time\": \"04:01 PM\"}",
    "magrib": "{\"text_ar\": \"مغرب\", \"text_bn\": \"মাগরিব\", \"text_en\": \"Magrib\", \"end_time\": \"06:30 PM\", \"start_time\": \"05:37 PM\"}",
    "esha": "{\"text_ar\": \"عشاء\", \"text_bn\": \"ঈশা\", \"text_en\": \"Esha\", \"end_time\": \"11:59 PM\", \"start_time\": \"06:56 PM\"}",
    "tahazzud": "{\"text_ar\": \"تهجد\", \"text_bn\": \"তাহাজ্জুদ\", \"text_en\": \"Tahazzud\", \"end_time\": \"04:20 AM\", \"start_time\": \"12:00 AM\"}",
    "sehri": "{\"text_ar\": \"سحري\", \"text_bn\": \"সেহরী\", \"text_en\": \"Sehri\", \"end_time\": \"03:16 AM\", \"start_time\": \"04:16 AM\"}",
    "sunrise": "{\"text_ar\": \"شروق الشمس\", \"text_bn\": \"সূর্যোদয়\", \"text_en\": \"Sunrise\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "ishraq": "{\"text_ar\": \"إشراق\", \"text_bn\": \"ইশরাক\", \"text_en\": \"Ishraq\", \"end_time\": \"06:30 PM\", \"start_time\": \"11:00 PM\"}",
    "forbidden": "{\"text_ar\": \"وقت محظور\", \"text_bn\": \"নিষিদ্ধ সময়\", \"text_en\": \"Forbidden Time\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "created_at": null,
    "updated_at": null
  };

function getNextPrayerTime(time) {
    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });

    if (currentDay == time.day) {
        let foundCurrentPrayer = false;

        for (let prayer in time) {
            if (time.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && time[prayer]) {
                let prayerTime = JSON.parse(time[prayer]);
                let startTime = parseTime(prayerTime.start_time);
                let endTime = parseTime(prayerTime.end_time);
                let currentParsedTime = parseTime(currentTime);

                if (currentParsedTime >= startTime && currentParsedTime <= endTime) {
                    foundCurrentPrayer = true;
                } else if (foundCurrentPrayer) {
                    return time[prayer]; // Return the next prayer time after the current time
                }
            }
        }
    }

    return null;
}

function parseTime(timeString) {
  let currentDate = new Date().toISOString().split('T')[0];
  let time = new Date(`${currentDate} ` + timeString);
  return time.toLocaleTimeString('en-US', { hour12: false });
}

let nextPrayer = getNextPrayerTime(time);
console.log("Next Prayer Time:", nextPrayer);

  export default {
    components: {
    TheHeader,
    TheLoading
  },
    data(){
      return {
        loading: false,
        tasbihs: null,
      }
    },
    methods: {
      async fetchTasbihs() {
        this.loading = true;
        axios.get(`${import.meta.env.VITE_BASE_URL}/tasbih`)
        .then(response => {
          setTimeout(() => {
            this.loading = false;
            this.tasbihs = JSON.parse(response?.data?.data?.tasbih);
          }, 1000);
        })
        .catch(error => {
          this.loading = false;
          console.error('Error fetching data:', error);
        });
      }
    },
    created() {
      this.fetchTasbihs();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20" src="../assets/images/icons/tasbih.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Tasbih</h1>
    </div>
  </the-loading>
  <template v-if="!loading">    
    <TheHeader title="Tasbih"/>
    <div class="tasbih-area px-5 py-4">
      <div v-for="(tasbih, index) in tasbihs" :key="index" class="tasbih mb-3 p-3 border-2 border-primary rounded-3xl flex items-center justify-between gap-3 bg-tasbih bg-cover bg-center bg-no-repeat">
        <div class="tasbih-content flex-1 text-center">
          <h3 class="text-3xl">{{ tasbih.text_ar }}</h3>
          <p class="text-base py-1">{{ tasbih.text_en }}</p>
          <p>{{ tasbih.text_bn }}</p>
          <div class="counts mt-2 grid grid-cols-3 gap-1 text-sm">
            <div class="count">
              <p>Today</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
            <div class="count">
              <p>Monthly</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
            <div class="count">
              <p>Yearly</p>
              <p>{{ tasbih.today_count }}</p>
            </div>
          </div>
        </div>
        <div class="tasbih-right p-1">
          <div class="right-btn"></div>
          <div class="right-count text-primary">
            <h3 class="text-lg"><span class="text-4xl">{{ tasbih.count }}</span>/{{ tasbih.reset_on }}</h3>
            <p class="text-xs">Sub Total: 0</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>