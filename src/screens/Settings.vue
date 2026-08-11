<script>
  import api, { unwrap } from '@/services/api';
  import { getSettings, saveSettings, clearDistrictScopedCaches } from '@/services/settings';
  import { readCache } from '@/services/cache';
  import {
    NOTIFIABLE, getNotificationSettings, saveNotificationSettings,
    requestPermission, reschedule, cancelAll,
  } from '@/services/notifications';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';

  export default {
    components: { TheHeader, TheLoading, TheError },
    data() {
      const settings = getSettings();

      return {
        divisions: [],
        loading: false,
        error: false,
        saved: false,
        selectedDivision: null,
        selectedDistrict: settings.districtId,
        waqts: NOTIFIABLE,
        notifications: getNotificationSettings(),
        permissionDenied: false,
        pendingCount: 0,
      }
    },
    computed: {
      districts() {
        return this.divisions.find((d) => d.id === this.selectedDivision)?.districts ?? [];
      },
      currentLabel() {
        const { districtName, divisionName } = getSettings();
        return districtName ? `${districtName}, ${divisionName}` : 'Dhaka (default)';
      },
    },
    methods: {
      async fetchDivisions() {
        this.loading = true;

        try {
          this.divisions = unwrap(await api.get('/divisions'));
          this.error = false;

          // Preselect the division that owns the saved district.
          const saved = this.selectedDistrict;
          if (saved) {
            const owner = this.divisions.find((d) => d.districts?.some((x) => x.id === saved));
            this.selectedDivision = owner?.id ?? this.divisions[0]?.id ?? null;
          } else {
            this.selectedDivision = this.divisions[0]?.id ?? null;
          }
        } catch (error) {
          this.error = true;
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },

      onDivisionChange() {
        // The old district belongs to the previous division.
        this.selectedDistrict = null;
        this.saved = false;
      },

      save() {
        const district = this.districts.find((d) => d.id === this.selectedDistrict);
        const division = this.divisions.find((d) => d.id === this.selectedDivision);

        saveSettings({
          districtId: district?.id ?? null,
          districtName: district?.name ?? null,
          divisionName: division?.name ?? null,
        });

        // Cached calendars hold the previous district's times.
        clearDistrictScopedCaches();

        // The cached calendar was the old district's; drop the reminders built from it.
        cancelAll();
        this.pendingCount = 0;

        this.saved = true;
      },

      // --------------------------------------------------------- notifications

      cachedCalendar() {
        // Stale is fine here: reminders are rebuilt from whatever the app last saw.
        return readCache('calendar', { allowStale: true }) ?? [];
      },

      async applyNotificationSettings() {
        saveNotificationSettings(this.notifications);
        this.pendingCount = await reschedule(this.cachedCalendar());
      },

      async toggleNotifications() {
        if (!this.notifications.enabled) {
          // Android 13+ and iOS both need an explicit grant before anything schedules.
          const granted = await requestPermission();
          this.permissionDenied = !granted;
          if (!granted) return;
        }

        this.notifications.enabled = !this.notifications.enabled;

        if (!this.notifications.enabled) {
          saveNotificationSettings(this.notifications);
          await cancelAll();
          this.pendingCount = 0;
          return;
        }

        await this.applyNotificationSettings();
      },

      async toggleWaqt(key) {
        this.notifications.waqts = {
          ...this.notifications.waqts,
          [key]: !this.notifications.waqts[key],
        };
        await this.applyNotificationSettings();
      },

      useDhaka() {
        saveSettings({ districtId: null, districtName: null, divisionName: null });
        clearDistrictScopedCaches();
        this.selectedDistrict = null;
        this.saved = true;
      },
    },
    mounted() {
      this.fetchDivisions();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="../assets/images/setting.svg" alt="Settings">
      <h1 class="text-2xl font-bold mt-3">Settings</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading && !error">
    <TheHeader title="Settings"/>

    <div class="settings-area px-5 py-4">
      <div class="current bg-white shadow-3xl rounded-2xl p-4 mb-4">
        <p class="text-xs text-darkGreen">Prayer times are shown for</p>
        <p class="text-lg font-bold text-primary">{{ currentLabel }}</p>
      </div>

      <div class="picker bg-white shadow-3xl rounded-2xl p-4">
        <h3 class="text-base font-bold pb-3">Your district</h3>
        <p class="text-xs text-darkGreen pb-4">
          Sehri and iftar differ by district — up to 12 minutes from Dhaka.
        </p>

        <label class="block text-sm font-medium pb-1">Division</label>
        <select
          v-model="selectedDivision"
          @change="onDivisionChange"
          class="w-full mb-4 px-4 py-2 border-2 border-primary rounded-2xl outline-none bg-white"
        >
          <option v-for="division in divisions" :key="division.id" :value="division.id">
            {{ division.name }}
          </option>
        </select>

        <label class="block text-sm font-medium pb-1">District</label>
        <select
          v-model="selectedDistrict"
          @change="saved = false"
          class="w-full mb-5 px-4 py-2 border-2 border-primary rounded-2xl outline-none bg-white"
        >
          <option :value="null" disabled>Select your district</option>
          <option v-for="district in districts" :key="district.id" :value="district.id">
            {{ district.name }}
          </option>
        </select>

        <button
          @click="save"
          :disabled="!selectedDistrict"
          class="w-full bg-primary text-white py-3 rounded-2xl font-semibold disabled:opacity-50"
        >
          Save
        </button>

        <button
          @click="useDhaka"
          class="w-full mt-2 py-3 rounded-2xl font-semibold text-primary border-2 border-primary"
        >
          Use Dhaka (default)
        </button>

        <p v-if="saved" class="text-center text-sm text-primary font-semibold pt-4">
          Saved. Prayer times will refresh.
        </p>
      </div>

      <div class="notifications bg-white shadow-3xl rounded-2xl p-4 mt-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold">Prayer reminders</h3>
          <button
            @click="toggleNotifications"
            :class="[
              'px-4 py-1 rounded-full text-sm font-semibold border-2 border-primary',
              notifications.enabled ? 'bg-primary text-white' : 'text-primary'
            ]"
          >
            {{ notifications.enabled ? 'On' : 'Off' }}
          </button>
        </div>

        <p v-if="permissionDenied" class="text-xs text-red-600 pt-3">
          Notifications are blocked. Enable them for this app in your device settings.
        </p>

        <template v-if="notifications.enabled">
          <p class="text-xs text-darkGreen pt-3 pb-3">Remind me for</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="waqt in waqts"
              :key="waqt.key"
              @click="toggleWaqt(waqt.key)"
              :class="[
                'px-3 py-2 rounded-2xl text-sm font-medium border-2',
                notifications.waqts[waqt.key]
                  ? 'bg-primary text-white border-primary'
                  : 'text-primary border-gainsboro'
              ]"
            >
              {{ waqt.label }}
            </button>
          </div>

          <label class="block text-sm font-medium pt-4 pb-1">Notify me</label>
          <select
            v-model.number="notifications.minutesBefore"
            @change="applyNotificationSettings"
            class="w-full px-4 py-2 border-2 border-primary rounded-2xl outline-none bg-white"
          >
            <option :value="0">At the time</option>
            <option :value="5">5 minutes before</option>
            <option :value="10">10 minutes before</option>
            <option :value="15">15 minutes before</option>
            <option :value="30">30 minutes before</option>
          </select>

          <p class="text-xs text-darkGreen pt-3">
            {{ pendingCount }} reminders scheduled for the next 7 days.
          </p>
        </template>
      </div>

      <p class="text-xs text-darkGreen text-center pt-6 pb-8">
        Offsets follow the Islamic Foundation's district table.
      </p>
    </div>
  </template>
</template>
