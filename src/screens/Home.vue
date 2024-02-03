<script>
  import axios from 'axios';
  import Loading from '@/components/Loading.vue';
  import NextSalat from '@/components/home/NextSalat.vue';
  import HeaderArea from '@/components/home/HeaderArea.vue';
  import MenuOption from '@/components/home/MenuOption.vue';
  import SocialMedia from '@/components/home/SocialMedia.vue';
  import PresentSalat from '@/components/home/PresentSalat.vue';
  import TomorrowSchedule from '@/components/home/TomorrowSchedule.vue';
  import ProhibitedTimes from '@/components/home/ProhibitedTimes.vue';

  // new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' })
  // new Date().toLocaleTimeString( 'en-US', { timeZone: 'Asia/Dhaka', hour12: true, hour: 'numeric', minute: 'numeric' })

  export default {
    components: {
      Loading,
      HeaderArea,
      MenuOption,
      PresentSalat,
      NextSalat,
      TomorrowSchedule,
      ProhibitedTimes,
      SocialMedia,
    },
    data() {
      return {
        time: [
          {
            "id": 1,
            "month_id": 1,
            "day": "03",
            "fazr": "{\"text_ar\": \"فجر\", \"text_bn\": \"ফজর\", \"text_en\": \"Fazr\", \"end_time\": \"06:08 AM\", \"start_time\": \"05:23 AM\"}",
            "johr": "{\"text_ar\": \"جوهر\", \"text_bn\": \"জোহর\", \"text_en\": \"Johr\", \"end_time\": \"03:00 PM\", \"start_time\": \"12:09 PM\"}",
            "asr": "{\"text_ar\": \"عصر\", \"text_bn\": \"আসর\", \"text_en\": \"Asr\", \"end_time\": \"05:30 PM\", \"start_time\": \"04:01 PM\"}",
            "magrib": "{\"text_ar\": \"مغرب\", \"text_bn\": \"মাগরিব\", \"text_en\": \"Magrib\", \"end_time\": \"06:30 PM\", \"start_time\": \"05:37 PM\"}",
            "esha": "{\"text_ar\": \"عشاء\", \"text_bn\": \"ঈশা\", \"text_en\": \"Esha\", \"end_time\": \"11:10 PM\", \"start_time\": \"06:56 PM\"}",
            "tahazzud": "{\"text_ar\": \"تهجد\", \"text_bn\": \"তাহাজ্জুদ\", \"text_en\": \"Tahazzud\", \"end_time\": \"04:20 AM\", \"start_time\": \"11:30 PM\"}",
            "sehri": "{\"text_ar\": \"سحري\", \"text_bn\": \"সেহরী\", \"text_en\": \"Sehri\", \"end_time\": \"03:16 AM\", \"start_time\": \"04:16 AM\"}",
            "sunrise": "{\"text_ar\": \"شروق الشمس\", \"text_bn\": \"সূর্যোদয়\", \"text_en\": \"Sunrise\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
            "ishraq": "{\"text_ar\": \"إشراق\", \"text_bn\": \"ইশরাক\", \"text_en\": \"Ishraq\", \"end_time\": \"06:30 PM\", \"start_time\": \"11:00 PM\"}",
            "forbidden": "{\"text_ar\": \"وقت محظور\", \"text_bn\": \"নিষিদ্ধ সময়\", \"text_en\": \"Forbidden Time\", \"end_time\": \"05:16 AM\", \"start_time\": \"05:16 AM\"}",
            "created_at": null,
            "updated_at": null
          },
          {
            "id": 1,
            "month_id": 1,
            "day": "26",
            "fazr": "{\"text_ar\": \"فجر\", \"text_bn\": \"ফজর\", \"text_en\": \"Fazr\", \"end_time\": \"12:08 PM\", \"start_time\": \"05:23 AM\"}",
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
          }
        ],
        calendar: [],
        loading: false,
        currentTime: new Date().getTime(),
        storedData: localStorage.getItem('calendarData'),
        storedTimestamp: localStorage.getItem('calendarTimestamp'),
        // Present and Next Salat Functionality
        leftTime: null,
        nextSalat: null,
        intervalId: null,
        presentSalat: null,
        currentDate: new Date(),
        formattedDate: new Date().toISOString().split('T')[0],
      };
    },
    methods: {    
      async fetchCalenderData() {
        this.loading = true;
        
        if (this.storedData && this.storedTimestamp && (this.currentTime - parseInt(this.storedTimestamp) < 24 * 60 * 60 * 1000)) {
          this.calendar = JSON.parse(this.storedData);
          this.loading = false;
        } else {
          try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/permanent-calendar`);
            this.calendar = response.data?.data?.permanent_calendars;
            
            localStorage.setItem('calendarData', JSON.stringify(this.calendar));
            localStorage.setItem('calendarTimestamp', this.currentTime.toString());
          } catch (error) {
            this.loading = false;
            console.error('Error fetching data:', error);
          } finally {
            this.loading = false;
          }
        }
      },
      tomorrowSahriIfter(){        
        return {
          sehri: JSON.parse(this.time[1].sehri),
          ifter: JSON.parse(this.time[1].magrib),
        };
      },
      parseTime(timeString) {
        let time = new Date(`${this.formattedDate} ` + timeString);
        return time.toLocaleTimeString('en-US', { hour12: false });
      },
      getCurrentPrayerTime() {
        if (this.currentDate.getDate() == this.time[0].day) {
          let foundCurrentPrayer = false;
          let currentTime = this.currentDate.toLocaleTimeString('en-US', { hour12: false });

          for (let prayer in this.time[0]) {
            if (this.time[0].hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && this.time[0][prayer]) {
              let prayerTime = JSON.parse(this.time[0][prayer]);

              if ( this.parseTime(currentTime) >= this.parseTime(prayerTime.start_time) && this.parseTime(currentTime) <= this.parseTime(prayerTime.end_time)) {
                this.presentSalat = JSON.parse(this.time[0][prayer]);
                foundCurrentPrayer = true;
              } else if (this.parseTime(currentTime) >= this.parseTime(prayerTime.start_time) === true && this.parseTime(currentTime) <= this.parseTime(prayerTime.end_time) === false ) {
                foundCurrentPrayer = true;
              } else if (foundCurrentPrayer) {
                this.nextSalat = JSON.parse(this.time[0][prayer]);
                break;
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
    mounted() {
      this.fetchCalenderData();
    },
    created(){
      this.getCurrentPrayerTime();
      this.getTimeLeftUntilEnd();

      this.intervalId = setInterval(() => {
        this.currentDate = new Date();
        this.getTimeLeftUntilEnd();
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
  };
</script>

<template>
  <Loading v-if="loading" />
  <div v-if="!loading" class="home-screen p-4">
    <HeaderArea/>
    <PresentSalat :present="presentSalat" :time="leftTime" />
    <NextSalat :next="nextSalat"/>
    <TomorrowSchedule :tomorrow="tomorrowSahriIfter()" />
    <MenuOption/>
    <ProhibitedTimes/>
    <SocialMedia/>
  </div>
</template>