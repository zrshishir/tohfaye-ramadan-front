
<script>
  import api from '@/services/api';
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
        calendar: [],
        loading: false,
        currentTime: new Date().getTime(),
        storedData: localStorage.getItem('calendarData'),
        storedTimestamp: localStorage.getItem('calendarTimestamp'),
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
        if (this.storedData) {
          this.calendar = JSON.parse(this.storedData);
          this.loading = false;
        } else {
          try {
            const response = await api.post('/permanent-calendar');
            this.calendar = response.data?.data?.permanent_calendars?.data || [];
            
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
        const tomorrowDate = new Date(this.currentDate);
        tomorrowDate.setDate(this.currentDate.getDate() + 1);
        const tomorrowDaySalat = this.calendar.filter(date => parseInt(date.day) === tomorrowDate.getDate());

        return { sehri: tomorrowDaySalat[0]?.sehri, ifter: tomorrowDaySalat[0]?.magrib };
      },
      parseTime(timeString) {
        let time = new Date(`${this.formattedDate} ` + timeString);
        return time.toLocaleTimeString('en-US', { hour12: false });
      },
      getCurrentPrayerTime() {
        const currentDaySalat = this.calendar.filter(date => parseInt(date.day) === this.currentDate.getDate());
        
        if (this.currentDate.getDate() == currentDaySalat[0]?.day) {
          let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          let todayWeekdayName = weekdays[this.currentDate.getDay()];

          let currentTime = this.currentDate.toLocaleTimeString('en-US', { hour12: false });
          let foundCurrentPrayer = false;

          for (let prayer in currentDaySalat[0]) {
            const isFriday = todayWeekdayName === 'Friday' ? prayer !== "johr" : prayer !== "jummah";

            if ( isFriday && currentDaySalat[0]?.hasOwnProperty(prayer) && prayer !== "day" && prayer !== "id" && prayer !== "month_id" && prayer !== "forbidden" && currentDaySalat[0][prayer]) {
              let prayerTime = currentDaySalat[0][prayer];

              if ( this.parseTime(currentTime) >= this.parseTime(prayerTime.start_time) && this.parseTime(currentTime) <= this.parseTime(prayerTime.end_time)) {
                this.presentSalat = currentDaySalat[0][prayer];
                foundCurrentPrayer = true;
              } else if (this.parseTime(currentTime) >= this.parseTime(prayerTime.start_time) === true && this.parseTime(currentTime) <= this.parseTime(prayerTime.end_time) === false ) {
                foundCurrentPrayer = true;
              } else if (foundCurrentPrayer) {
                this.nextSalat = currentDaySalat[0][prayer];
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
    created(){
      this.fetchCalenderData().then(() => {
      this.getCurrentPrayerTime();
      this.getTimeLeftUntilEnd();

      this.intervalId = setInterval(() => {
        this.currentDate = new Date();
        this.getTimeLeftUntilEnd();
      }, 60000);
    });
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
    <ProhibitedTimes :prohibited="this.calendar[0]?.forbidden"/>
    <SocialMedia/>
  </div>
</template>