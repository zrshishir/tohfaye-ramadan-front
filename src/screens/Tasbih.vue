<script>
  import axios from 'axios';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import TheNoData from '@/components/TheNoData.vue';

  // No accounts yet, so every device shares the seeded default row.
  const USER_ID = 1;
  const CACHE_KEY = 'tasbih';
  const SYNC_DELAY = 1500;

  const todayKey = () => {
    const now = new Date();
    return {
      day:   now.toISOString().slice(0, 10),
      month: now.getMonth(),
      year:  now.getFullYear(),
    };
  };

  export default {
    components: {
      TheHeader,
      TheLoading,
      TheError,
      TheNoData
    },
    data() {
      return {
        tasbihs: [],
        error: false,
        loading: false,
        // Period bookkeeping. These were previously read off `this` without ever
        // being declared, so the daily reset never fired and the monthly/yearly
        // counters were zeroed on the first tap of every visit.
        lastCountedDay: null,
        lastCountedMonth: null,
        lastCountedYear: null,
        syncTimer: null,
      }
    },
    methods: {
      // ------------------------------------------------------------- storage

      readCache() {
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed?.tasbihs) ? parsed : null;
        } catch {
          // A previous build stored a bare JSON string under this key.
          localStorage.removeItem(CACHE_KEY);
          return null;
        }
      },

      writeCache() {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          tasbihs: this.tasbihs,
          lastCountedDay: this.lastCountedDay,
          lastCountedMonth: this.lastCountedMonth,
          lastCountedYear: this.lastCountedYear,
        }));
      },

      // --------------------------------------------------------------- fetch

      async fetchTasbihs() {
        this.loading = true;

        const cached = this.readCache();
        if (cached) {
          this.lastCountedDay   = cached.lastCountedDay ?? null;
          this.lastCountedMonth = cached.lastCountedMonth ?? null;
          this.lastCountedYear  = cached.lastCountedYear ?? null;
        }

        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasbih`, {
            params: { user_id: USER_ID },
          });

          // `data.tasbih` is a JSON array. It used to be a JSON-encoded string
          // that the client had to JSON.parse().
          const serverTasbihs = response.data?.data?.tasbih ?? [];

          // Server owns the dhikr list (text, reset_on); the device owns the counters.
          this.tasbihs = serverTasbihs.map((dhikr) => {
            const local = cached?.tasbihs?.find((t) => t.text_en === dhikr.text_en);
            return local ? { ...dhikr, ...this.countsOf(local) } : { ...dhikr };
          });

          this.error = false;
        } catch (error) {
          // Offline or the row is missing — fall back to whatever we have locally.
          if (cached?.tasbihs?.length) {
            this.tasbihs = cached.tasbihs;
            this.error = false;
          } else {
            this.tasbihs = [];
            this.error = error.response?.status !== 404;
          }
          console.error('Error fetching data:', error);
        } finally {
          this.applyPeriodResets();
          this.loading = false;
        }
      },

      countsOf(dhikr) {
        return {
          count:         dhikr.count ?? 0,
          today_count:   dhikr.today_count ?? 0,
          monthly_count: dhikr.monthly_count ?? 0,
          yearly_count:  dhikr.yearly_count ?? 0,
          total_count:   dhikr.total_count ?? 0,
        };
      },

      // -------------------------------------------------------------- counting

      /**
       * Zero the periodic counters when the calendar period has rolled over.
       * Runs on load and before every increment, so a session left open
       * overnight still rolls correctly.
       */
      applyPeriodResets() {
        if (!this.tasbihs.length) return;

        const { day, month, year } = todayKey();

        if (this.lastCountedDay && this.lastCountedDay !== day) {
          this.tasbihs.forEach((t) => { t.today_count = 0; t.count = 0; });
        }
        if (this.lastCountedMonth !== null && this.lastCountedMonth !== month) {
          this.tasbihs.forEach((t) => { t.monthly_count = 0; });
        }
        if (this.lastCountedYear !== null && this.lastCountedYear !== year) {
          this.tasbihs.forEach((t) => { t.yearly_count = 0; });
        }
      },

      counterHandler(tasbih) {
        this.applyPeriodResets();

        const { day, month, year } = todayKey();

        tasbih.count         = (tasbih.count ?? 0) + 1;
        tasbih.today_count   = (tasbih.today_count ?? 0) + 1;
        tasbih.monthly_count = (tasbih.monthly_count ?? 0) + 1;
        tasbih.yearly_count  = (tasbih.yearly_count ?? 0) + 1;
        tasbih.total_count   = (tasbih.total_count ?? 0) + 1;

        if (tasbih.reset_on > 0 && tasbih.count >= tasbih.reset_on) {
          tasbih.count = 0;
        }

        this.lastCountedDay   = day;
        this.lastCountedMonth = month;
        this.lastCountedYear  = year;

        this.writeCache();
        this.scheduleSync();
      },

      // ----------------------------------------------------------------- sync

      scheduleSync() {
        clearTimeout(this.syncTimer);
        this.syncTimer = setTimeout(() => this.syncToServer(), SYNC_DELAY);
      },

      /**
       * Counters previously lived only in memory — nothing was ever written back,
       * so every tap was lost when the screen was closed.
       */
      async syncToServer() {
        if (!this.tasbihs.length) return;

        try {
          await axios.put(`${import.meta.env.VITE_BASE_URL}/tasbih/${USER_ID}`, {
            tasbih: this.tasbihs,
          });
        } catch (error) {
          // Counters are safe in localStorage; the next tap retries.
          console.error('Error syncing tasbih counts:', error);
        }
      },
    },
    created() {
      this.fetchTasbihs();
    },
    beforeUnmount() {
      // Flush a pending debounce so leaving the screen does not drop the last taps.
      if (this.syncTimer) {
        clearTimeout(this.syncTimer);
        this.syncToServer();
      }
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
    <TheNoData v-if="!error && !tasbihs.length"/>
    <div v-if="tasbihs.length" class="tasbih-area px-5 py-4">
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
