<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: {
    TheHeader,
    TheLoading,
    TheError,
    TheNoData
  },
    data(){
      return {
        counter: 0,
        tasbihs: [],
        error: false,
        loading: false,
        storedTasbihs: localStorage.getItem('tasbih'),
      }
    },
    methods: {
      async fetchTasbihs() {
        this.loading = true;

        if (this.storedTasbihs) {
          this.tasbihs = JSON.parse(this.storedTasbihs);
          this.loading = false;
          this.error = false;
        } else {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasbih`);            
            this.tasbihs = JSON.parse(response.data?.data?.tasbih);
            localStorage.setItem('tasbih', response.data?.data?.tasbih);
            this.loading = false;
            this.error = false;            
          } catch (error) {
            this.loading = false;
            this.error = true;
            console.error('Error fetching data:', error);
          }
        }
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
  <TheError v-if="error"/>
  <template v-if="!loading">    
    <TheHeader title="Tasbih"/>
    <TheNoData v-if="tasbihs === 0"/>
    <div v-if="tasbihs !== 0" class="tasbih-area px-5 py-4">
      <div v-for="(tasbih, index) in tasbihs" :key="index" class="tasbih mb-3 p-3 border-2 border-primary rounded-3xl flex items-center justify-between gap-3 bg-tasbih bg-cover bg-center bg-no-repeat">
        <div class="tasbih-content flex-1 text-center">
          <h3 class="text-3xl">{{ tasbih?.text_ar }}</h3>
          <p class="text-base py-1">{{ tasbih?.text_en }}</p>
          <p>{{ tasbih?.text_bn }}</p>
          <div class="counts mt-2 grid grid-cols-3 gap-1 text-sm">
            <div class="count">
              <p>Monthly</p>
              <p>{{ tasbih?.monthly_count }}</p>
            </div>
            <div class="count">
              <p>Yearly</p>
              <p>{{ tasbih?.yearly_count }}</p>
            </div>
            <div class="count">
              <p>Total</p>
              <p>{{ tasbih?.total_count }}</p>
            </div>
          </div>
        </div>
        <div class="tasbih-right p-1">
          <div class="right-count text-primary mb-3">
            <h3 class="text-lg"><span class="text-4xl">{{ tasbih?.count }}</span>{{ tasbih?.reset_on ? `/${tasbih?.reset_on}` : '' }}</h3>
            <p class="text-xs">Today: {{ tasbih?.today_count }}</p>
          </div>
          <button class="tasbih-button" @click="counterHandler(tasbih)">
            <div class="bloom-container">
              <div class="tasbih-button-container-main">
                <div class="tasbih-button-inner">
                  <div class="back"></div>
                  <div class="front uppercase font-bold text-white text-lg">tap</div>
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