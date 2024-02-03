<script>
  import axios from 'axios';
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
        tasbihs: null,
        counter: 0,
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
      },
      counterHandler(tasbih) {
        const currentTime = Date.now();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (this.isPast24Hours(this.lastResetTimestamp, currentTime)) {
          this.lastResetTimestamp = currentTime;
          tasbih.today_count = 1;
          tasbih.count = 1;
        } else {
          tasbih.today_count++;
          tasbih.count++;
        }

        if (!this.isSameMonth(this.currentMonth, currentMonth)) {
          tasbih.monthly_count = 0;
        }

        if (!this.isSameYear(this.currentYear, currentYear)) {
          tasbih.yearly_count = 0;
        }
        
        tasbih.monthly_count++;
        tasbih.yearly_count++;
        tasbih.total_count++;

        if (tasbih.count === tasbih.reset_on) {
          tasbih.count = 0;
        }

        this.currentMonth = currentMonth;
        this.currentYear = currentYear;
      },
      isPast24Hours(startTimestamp, endTimestamp) {
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        return endTimestamp - startTimestamp >= millisecondsInDay;
      },
      isSameMonth(month1, month2) {
        return month1 === month2;
      },
      isSameYear(year1, year2) {
        return year1 === year2;
      },
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
              <p>Monthly</p>
              <p>{{ tasbih.monthly_count }}</p>
            </div>
            <div class="count">
              <p>Yearly</p>
              <p>{{ tasbih.yearly_count }}</p>
            </div>
            <div class="count">
              <p>Total</p>
              <p>{{ tasbih.total_count }}</p>
            </div>
          </div>
        </div>
        <div class="tasbih-right p-1">
          <div class="right-count text-primary mb-3">
            <h3 class="text-lg"><span class="text-4xl">{{ tasbih.count }}</span>{{ tasbih.reset_on ? `/${tasbih.reset_on}` : '' }}</h3>
            <p class="text-xs">Today: {{ tasbih.today_count }}</p>
          </div>
          <button class="tasbih-button" @click="counterHandler(tasbih)">
            <div class="bloom-container">
              <div class="tasbih-button-container-main">
                <div class="tasbih-button-inner">
                  <div class="back"></div>
                  <div class="front">
                    <svg viewBox="0 0 512 512" class="svg" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
                  </div>
                </div>
                <div class="tasbih-button-glass">
                  <div class="back"></div>
                  <div class="front"></div>
                </div>
              </div>
              <div class="bloom bloom1"></div>
              <div class="bloom bloom2"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </template>
</template>