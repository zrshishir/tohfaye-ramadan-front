<script>
  import TheHeader from '@/components/TheHeader.vue';

  const time = {
    "id": 1,
    "month_id": 1,
    "day": "20",
    "sehri": "{\"text_ar\": \"سحري\", \"text_bn\": \"সেহরী\", \"text_en\": \"Sehri\", \"end_time\": \"03:16 AM\", \"start_time\": \"04:16 AM\"}",
    "fazr": "{\"text_ar\": \"فجر\", \"text_bn\": \"ফজর\", \"text_en\": \"Fazr\", \"end_time\": \"11:59 AM\", \"start_time\": \"05:16 AM\"}",
    "sunrise": "{\"text_ar\": \"شروق الشمس\", \"text_bn\": \"সূর্যোদয়\", \"text_en\": \"Sunrise\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "ishraq": "{\"text_ar\": \"إشراق\", \"text_bn\": \"ইশরাক\", \"text_en\": \"Ishraq\", \"end_time\": \"06:30 PM\", \"start_time\": \"11:00 PM\"}",
    "johr": "{\"text_ar\": \"جوهر\", \"text_bn\": \"জোহর\", \"text_en\": \"Johr\", \"end_time\": \"03:00 PM\", \"start_time\": \"12:10 PM\"}",
    "asr": "{\"text_ar\": \"عصر\", \"text_bn\": \"আসর\", \"text_en\": \"Asr\", \"end_time\": \"05:00 PM\", \"start_time\": \"03:00 PM\"}",
    "magrib": "{\"text_ar\": \"مغرب\", \"text_bn\": \"মাগরিব\", \"text_en\": \"Magrib\", \"end_time\": \"06:30 PM\", \"start_time\": \"05:00 PM\"}",
    "esha": "{\"text_ar\": \"عشاء\", \"text_bn\": \"ঈশা\", \"text_en\": \"Esha\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "tahazzud": "{\"text_ar\": \"تهجد\", \"text_bn\": \"তাহাজ্জুদ\", \"text_en\": \"Tahazzud\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "jummah": "{\"text_ar\": \"جمعة\", \"text_bn\": \"জুম্মা\", \"text_en\": \"Jummah\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "forbidden": "{\"text_ar\": \"وقت محظور\", \"text_bn\": \"নিষিদ্ধ সময়\", \"text_en\": \"Forbidden Time\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
    "created_at": null,
    "updated_at": null
  };

  function getCurrentPrayerTime(time) {
    let currentDate = new Date();
    let currentDay = currentDate.getDate();

    if (currentDay == time.day) {
        let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });

        for (let prayer in time) {
          if (time.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && time[prayer]) {
            let prayerTime = JSON.parse(time[prayer]);
            let startTime = parseTime(prayerTime.start_time);
            let endTime = parseTime(prayerTime.end_time);
            let currentParsedTime = parseTime(currentTime);
            if (currentParsedTime >= startTime && currentParsedTime <= endTime) {
                return time[prayer];
            }
          }
        }
    }

    return null;
}

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

let currentPrayer = getCurrentPrayerTime(time);
console.log("Current Prayer Time:", currentPrayer);

let nextPrayer = getNextPrayerTime(time);
console.log("Next Prayer Time:", nextPrayer);


  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Tasbih"/>
  <div class="tasbih-area px-5 py-4">
    <div class="tasbih p-3 border-2 border-primary rounded-3xl flex items-center justify-between gap-3 bg-tasbih bg-cover bg-center bg-no-repeat">
      <div class="tasbih-content flex-1 text-center">
        <h3 class="text-3xl">ٱلْحَمْدُ لِلّٰهِ</h3>
        <p class="text-base py-1">Suboha-nallah</p>
        <p>সকল প্রশংসা মহান আল্লাহর জন্য</p>
        <div class="counts mt-2 grid grid-cols-3 gap-1 text-sm">
          <p>Today: 00</p>
          <p>Monthly: 00</p>
          <p>Yearly: 00</p>
        </div>
      </div>
      <div class="tasbih-right p-1">
        <div class="right-btn"></div>
        <div class="right-count text-primary">
          <h3 class="text-lg"><span class="text-4xl">12</span>/33</h3>
          <p class="text-xs">Sub Total: 12</p>
        </div>
      </div>
    </div>
  </div>
</template>