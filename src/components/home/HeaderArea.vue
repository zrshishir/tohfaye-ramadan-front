<script>
  import { Geolocation } from '@capacitor/geolocation';
  import { Preferences } from '@capacitor/preferences';
  import { RouterLink } from 'vue-router';
  import { getSettings, saveSettings, clearDistrictScopedCaches } from '@/services/settings';
  import api from '@/services/api';

  export default {
    data() {
      return {
        location: null,
        storedLocation: localStorage.getItem('location'),
        suggestedDistrict: null,
        currentDate: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' }),
      };
    },
    methods: {
      async getUserLocationPhone() {
        // The chosen district is what actually drives prayer times; this label is
        // cosmetic, so it must never take the screen down.
        const chosen = getSettings();
        if (chosen.districtName) {
          this.location = { city: chosen.districtName, division: chosen.divisionName };
          return;
        }

        let position;
        try {
          position = await Geolocation.getCurrentPosition();
        } catch (error) {
          // Permission denied or no fix — fall back to whatever was stored.
          const stored = await Preferences.get({ key: 'location' }).catch(() => ({ value: null }));
          const raw = stored.value ?? this.storedLocation;
          if (raw) this.location = JSON.parse(raw);
          console.error('Error getting location:', error);
          return;
        }

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const storedLocationPhone = await Preferences.get({ key: 'location' });

        if (this.storedLocation || storedLocationPhone.value) {
          this.location = JSON.parse(this.storedLocation);

          if (storedLocationPhone.value) {            
            this.location = JSON.parse(storedLocationPhone.value);
          }
        } else {
          try {
            // Proxied through our own API: the Maps key used to be inlined in this
            // bundle, where anyone could extract it. It now lives only on the server.
            const { data } = await api.get('/geocode', {
              params: { lat: latitude, lng: longitude },
            });

            const resolved = data?.data;
            if (!resolved) return;

            this.location = {
              lat: latitude,
              lng: longitude,
              city: resolved.district?.name ?? resolved.city,
              division: resolved.division,
              districtId: resolved.district?.id ?? null,
            };

            localStorage.setItem('location', JSON.stringify(this.location));
            await Preferences.set({ key: 'location', value: JSON.stringify(this.location) });

            // The server matched a district, and that is what actually drives prayer
            // times. Offer it rather than making the user hunt through the picker.
            if (resolved.district?.id && !getSettings().districtId) {
              this.suggestedDistrict = resolved.district;
            }
          } catch (error) {
            console.error('Error resolving location:', error);
          }
        }
      },

      acceptSuggestedDistrict() {
        const district = this.suggestedDistrict;

        saveSettings({
          districtId: district.id,
          districtName: district.name,
          divisionName: district.division,
        });

        // Cached calendars were built for the previous district.
        clearDistrictScopedCaches();

        this.location = { ...this.location, city: district.name, division: district.division };
        this.suggestedDistrict = null;

        // Times have changed, so re-fetch rather than showing the old ones.
        window.location.reload();
      },
    },
    mounted() {
      this.getUserLocationPhone();
    }
  }
</script>

<template>
  <header>
    <div class="header-area mt-5 flex items-center justify-between">
      <p class="font-medium text-base">Prayer Pulse</p>
      <RouterLink to="/settings" aria-label="Settings">
        <img class="w-6 h-6" src="@/assets/images/setting.svg" alt="setting">
      </RouterLink>
    </div>
  </header>
  <div
    v-if="suggestedDistrict"
    class="district-suggestion mt-3 p-3 bg-white shadow-3xl rounded-2xl flex items-center justify-between gap-3"
  >
    <p class="text-sm">
      Show prayer times for <span class="font-bold">{{ suggestedDistrict.name }}</span>?
    </p>
    <div class="flex items-center gap-2 shrink-0">
      <button @click="suggestedDistrict = null" class="text-sm px-3 py-1 text-primary">
        Not now
      </button>
      <button
        @click="acceptSuggestedDistrict"
        class="text-sm px-3 py-1 bg-primary text-white rounded-full font-semibold"
      >
        Yes
      </button>
    </div>
  </div>

  <!-- Calender Start -->
  <div class="calender mt-3 mb-6 flex items-center justify-between">
    <div class="date">
      <div class="arabic-date flex items-center gap-3 pb-1">
        <p class="text-base font-medium">{{ currentDate }}</p>
        <!-- <p class="text-base font-medium">8 Jilhazz 1444</p> -->
        <!-- <img class="w-5 h-5" src="@/assets/images/up-arrow.svg" alt="up-arrow"> -->
      </div>
      <!-- <p class="text-primary text-xs">8 Jilhazz 1444 | 7 Falgun 1430</p> -->
    </div>
    <div class="location flex items-start gap-2 px-4 py-2 border-2 border-solid border-primary rounded-3xl	">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">{{ location?.city }}</span>
    </div>
  </div>
</template>