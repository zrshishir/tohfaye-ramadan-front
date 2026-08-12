<script>
  import api from '@/services/api';
  import {
    getReaderSettings, saveReaderSettings, fontClasses, FONT_SIZES,
    setLastRead, isBookmarked, toggleBookmark,
  } from '@/services/reader';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: {
      TheHeader,
      TheLoading,
      TheNoData
    },
    data() {
      return {
        ayat: [],
        loading: false,
        currentPage: 1,
        lastPage: 1,
        reader: getReaderSettings(),
        playingId: null,
        audio: null,
        showSettings: false,
        fontSizes: FONT_SIZES,
      }
    },
    computed: {
      font() {
        return fontClasses(this.reader.fontSize);
      },
    },
    methods: {
      // ------------------------------------------------------------- audio

      /**
       * One <Audio> reused for every ayat. Tapping the ayat that is already playing
       * stops it; tapping another switches over rather than overlapping.
       */
      togglePlay(data) {
        if (!data?.audio) return;

        if (this.playingId === data.id) {
          this.stopAudio();
          return;
        }

        this.stopAudio();

        this.audio = new Audio(data.audio);
        this.playingId = data.id;

        this.audio.addEventListener('ended', () => { this.playingId = null; });
        this.audio.addEventListener('error', () => {
          console.error('Could not play recitation for ayat', data.id);
          this.playingId = null;
        });

        this.audio.play().catch((error) => {
          console.error('Playback failed:', error);
          this.playingId = null;
        });
      },

      stopAudio() {
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
        }
        this.playingId = null;
      },

      // --------------------------------------------------------- bookmarks

      bookmarked(id) {
        return isBookmarked(id);
      },

      onBookmark(data) {
        toggleBookmark({
          ayatId: data.id,
          suraId: this.$route.params.id,
          suraName: this.$route.params.name,
          ayatNo: data.ayat_no,
          page: this.currentPage,
        });
        // Re-read so the icon reflects the stored state rather than a local guess.
        this.reader = getReaderSettings();
      },

      // ---------------------------------------------------------- settings

      setFontSize(id) {
        this.reader = saveReaderSettings({ fontSize: id });
      },

      toggleTranslation(key) {
        this.reader = saveReaderSettings({ [key]: !this.reader[key] });
      },

      rememberPosition() {
        if (!this.ayat.length) return;

        setLastRead({
          suraId: this.$route.params.id,
          suraName: this.$route.params.name,
          ayatNo: this.ayat[0]?.ayat_no,
          page: this.currentPage,
        });
      },

      async fetchData(page) {
        this.loading = true;
        const targetPage = page || parseInt(this.$route.query.page) || 1;

        try {
          const response = await api.get(`/ayat/${parseInt(this.$route?.params?.id)}?page=${targetPage}`);          
          
          const responseData = response.data?.data;
          let newAyats = [];
          
          if (Array.isArray(responseData)) {
            // Fallback for unpaginated API (e.g. if hitting live server)
            newAyats = responseData;
          } else if (responseData?.data) {
            // Paginated API
            newAyats = responseData.data;
          }

          this.ayat = newAyats;
          this.rememberPosition();
          this.currentPage = responseData?.current_page || 1;
          this.lastPage = responseData?.last_page || 1;

          if (parseInt(this.$route.query.page) !== this.currentPage) {
             this.$router.replace({ query: { ...this.$route.query, page: this.currentPage } });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      changePage(newPage) {
        if (newPage >= 1 && newPage <= this.lastPage) {
          this.fetchData(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    beforeUnmount() {
      // Otherwise the recitation keeps playing after the screen is gone.
      this.stopAudio();
    },
    mounted() {
      this.fetchData();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="@/assets/images/icons/quraan.svg" alt="Tasbih">
      <h1 class="text-2xl font-bold mt-3">Al-Quraan</h1>
    </div>
  </the-loading>
  <template v-if="!loading">
    <the-header :title="`${$route?.params?.name} (${$route?.params?.nameArabic})`">
      <div class="description">
        <span class="text-primary font-semibold">{{$route?.params?.type}} | Verses : {{$route?.params?.ayatCount}}</span>
      </div>
    </the-header>
    <div class="reader-bar px-5 pb-2 flex items-center justify-between">
      <button
        @click="showSettings = !showSettings"
        class="text-sm px-3 py-1 border-2 border-primary rounded-full text-primary font-medium"
      >
        Reading options
      </button>
      <span class="text-xs text-darkGreen">Tap an ayat number to listen</span>
    </div>

    <div v-if="showSettings" class="reader-settings mx-5 mb-3 p-4 bg-white shadow-3xl rounded-2xl">
      <p class="text-xs text-darkGreen pb-2">Arabic size</p>
      <div class="flex items-center gap-2 pb-4">
        <button
          v-for="(size, i) in fontSizes"
          :key="size.id"
          @click="setFontSize(size.id)"
          :class="[
            'px-4 py-1 rounded-full border-2 font-bold',
            reader.fontSize === size.id ? 'bg-primary text-white border-primary' : 'text-primary border-gainsboro'
          ]"
          :style="{ fontSize: `${0.75 + i * 0.2}rem` }"
        >
          {{ size.label }}
        </button>
      </div>

      <p class="text-xs text-darkGreen pb-2">Show</p>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="option in [
            { key: 'showPronunciation', label: 'উচ্চারণ' },
            { key: 'showBangla', label: 'অর্থ' },
            { key: 'showEnglish', label: 'English' },
          ]"
          :key="option.key"
          @click="toggleTranslation(option.key)"
          :class="[
            'px-4 py-1 rounded-full border-2 text-sm font-medium',
            reader[option.key] ? 'bg-primary text-white border-primary' : 'text-primary border-gainsboro'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <TheNoData v-if="ayat.length === 0"/>
    <div v-if="ayat.length !== 0" class="single-surah px-5 pb-3">
      <div v-for="(data, index) in ayat" :key="index" class="surah-ayat my-3 border border-primary rounded-xl">
        <div class="ayat-ar p-3 border-b border-primary flex items-start justify-between gap-3">
          <div class="flex flex-col items-center gap-2 shrink-0">
            <button
              @click="togglePlay(data)"
              :disabled="!data?.audio"
              :aria-label="playingId === data.id ? 'Stop recitation' : 'Play recitation'"
              :class="[
                'w-10 h-12 bg-ayat bg-no-repeat bg-center bg-cover flex items-center justify-center',
                playingId === data.id ? 'text-secondary font-bold' : '',
                !data?.audio ? 'opacity-50' : ''
              ]"
            >
              {{ data?.ayat_no <= 9 ? `0${data?.ayat_no}` : data?.ayat_no }}
            </button>

            <button
              @click="onBookmark(data)"
              :aria-label="bookmarked(data.id) ? 'Remove bookmark' : 'Bookmark this ayat'"
              class="text-lg leading-none"
            >
              <span :class="bookmarked(data.id) ? 'text-secondary' : 'text-gainsboro'">&#9733;</span>
            </button>
          </div>

          <p :class="[font.arabic, 'w-fit text-right leading-loose']" dir="rtl">{{ data?.arabic_text }}</p>
        </div>
        <!--
          Labels follow the convention the Dua screens already use:
            english_text = Latin pronunciation   meaning = Bangla meaning
          `bangla_text` should hold the Bangla uccharon, but the ayat seeder fills it
          from the same Bangla translation as `meaning`, so it is byte-identical to it
          in all 6,236 rows. It is left out rather than shown twice under two headings.
        -->
        <div v-if="reader.showPronunciation && data?.english_text" class="ayat-pr p-3 border-b border-primary">
          <p class="text-xs text-darkGreen pb-1 font-bold">উচ্চারণ</p>
          <p :class="font.translation">{{ data?.english_text }}</p>
        </div>
        <div v-if="reader.showBangla && data?.meaning" class="ayat-bn p-3 border-b border-primary">
          <p class="text-xs text-darkGreen pb-1 font-bold">অর্থ</p>
          <p :class="font.translation">{{ data?.meaning }}</p>
        </div>
        <!-- The English translation was imported into `notes` and never displayed. -->
        <div v-if="reader.showEnglish && data?.notes" class="ayat-en p-3">
          <p class="text-xs text-darkGreen pb-1 font-bold">English</p>
          <p :class="font.translation">{{ data?.notes }}</p>
        </div>
      </div> 
      <div v-if="lastPage > 1" class="flex items-center justify-between mt-6 mb-8">
        <button 
          @click="changePage(currentPage - 1)" 
          class="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <span class="font-bold text-primary">Page {{ currentPage }} of {{ lastPage }}</span>
        <button 
          @click="changePage(currentPage + 1)" 
          class="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="currentPage === lastPage"
        >
          Next
        </button>
      </div>
    </div>
  </template>
</template>