<script>
  export default {
    data(){
      return {
        time: {
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
        },
        presentSalat: null,
        leftTime: null,
        currentDate: new Date(),
        formattedDate: new Date().toISOString().split('T')[0],
      }
    },
    methods: {
      clickHandler() {
        this.$router.push({ path: '/time/present-time' });
      },
      parseTime(timeString) {
        let time = new Date(`${this.formattedDate} ` + timeString);
        return time.toLocaleTimeString('en-US', { hour12: false });
      },
      getCurrentPrayerTime() {
        if (this.currentDate.getDate() == this.time.day) {
          let currentTime = this.currentDate.toLocaleTimeString('en-US', { hour12: false });

          for (let prayer in this.time) {
            if (this.time.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && this.time[prayer]) {
              let prayerTime = JSON.parse(this.time[prayer]);
              
              if ( this.parseTime(currentTime) >= this.parseTime(prayerTime.start_time) && this.parseTime(currentTime) <= this.parseTime(prayerTime.end_time)) {
                this.presentSalat = JSON.parse(this.time[prayer]);
              }
            }
          }
        }

        return null;
      },
      getTimeLeftUntilEnd() {
        if (this.presentSalat) {
          const endTimeString = this.presentSalat.end_time;
          const endTime = new Date(`${this.formattedDate} ${endTimeString}`);

          let timeDifference = endTime - this.currentDate;
          timeDifference = Math.max(0, timeDifference);

          const hours = Math.floor(timeDifference / (60 * 60 * 1000));
          const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));

          this.leftTime = { hours, minutes };
        }

        return null;
      }
    },
    created(){
      this.getCurrentPrayerTime();
      this.getTimeLeftUntilEnd();
    }
  }
</script>

<template>
  <div @click="clickHandler()" class="present-salat bg-primary my-3 h-36 relative rounded-2xl overflow-auto">
    <div class="salat-content w-full px-6 py-3 text-white absolute top-0 left-0 z-10">
      {{ console.log(leftTime)
       }}
      <h3 class="pb-3 text-lg font-normal">Present Time</h3>
      <div class="salat flex items-center justify-between">
        <div class="salat-name flex items-center gap-2">
          <div class="dot bg-lightWhite w-6 h-6 rounded-full flex items-center justify-center">
            <span class="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <p class="text-lg font-medium">{{ presentSalat.text_en }} ({{ presentSalat.text_ar }})</p>
        </div>
        <p class="text-lg font-medium">{{ presentSalat.start_time }} - {{ presentSalat.end_time }}</p>
      </div>
      <p class="my-2 text-base font-light">Time left: {{ leftTime.hours }} hours {{ leftTime.minutes }} minutes</p>
      <div class="time-slides relative">
        <div class="slide absolute top-0 left-0 w-full h-1 bg-lightWhite rounded-full"></div>
        <div class="slide absolute top-0 left-0 w-2/4 h-1 bg-white rounded-full"></div>
      </div>
    </div>
    <img src="@/assets/images/mosque-bg.svg" class="absolute left-0 bottom-0" alt="Mosque Background" >
  </div>
</template>