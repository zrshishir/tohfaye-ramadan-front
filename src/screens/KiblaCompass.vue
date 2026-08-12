<script>
  import { Geolocation } from '@capacitor/geolocation';
  import TheHeader from '@/components/TheHeader.vue';
  import TheLoading from '@/components/TheLoading.vue';
  import TheError from '@/components/TheError.vue';
  import { qiblaBearing, headingFromOrientation, bearingDelta, compassPoint } from '@/helpers/qibla';

  const COORDS_KEY = 'qibla-coords';
  // If no orientation reading arrives in this window, assume there is no magnetometer.
  const COMPASS_TIMEOUT = 2500;

  export default {
    components: {
      TheHeader,
      TheLoading,
      TheError
    },
    data() {
      return {
        coords: null,
        qibla: null,
        heading: null,
        loading: false,
        error: false,
        compassUnavailable: false,
        needsPermission: false,
        location: JSON.parse(localStorage.getItem('location') || 'null'),
        orientationEvent: null,
        compassTimer: null,
      }
    },
    computed: {
      /**
       * How far to rotate the Kaaba marker on screen.
       * With a live heading the marker points at the Kaaba relative to the device;
       * without one it shows the absolute bearing and the user aligns north themselves.
       */
      needleRotation() {
        if (this.qibla === null) return 0;
        if (this.heading === null) return this.qibla;
        return (this.qibla - this.heading + 360) % 360;
      },
      qiblaLabel() {
        return this.qibla === null ? '—' : `${this.qibla.toFixed(1)}° ${compassPoint(this.qibla)}`;
      },
      /** True when the device is pointing within 5° of the Kaaba. */
      isAligned() {
        if (this.qibla === null || this.heading === null) return false;
        return Math.abs(bearingDelta(this.heading, this.qibla)) <= 5;
      },
    },
    methods: {
      // ------------------------------------------------------------- location

      async locate() {
        this.loading = true;

        const cached = this.readCachedCoords();

        try {
          const position = await Geolocation.getCurrentPosition({ timeout: 10000 });
          this.setCoords(position.coords.latitude, position.coords.longitude);
          localStorage.setItem(COORDS_KEY, JSON.stringify(this.coords));
          this.error = false;
        } catch (err) {
          // Permission denied or no fix — fall back to the last known position
          // rather than showing a dead screen.
          if (cached) {
            this.setCoords(cached.latitude, cached.longitude);
            this.error = false;
          } else {
            this.error = true;
          }
          console.error('Error getting location:', err);
        } finally {
          this.loading = false;
        }
      },

      readCachedCoords() {
        try {
          const raw = localStorage.getItem(COORDS_KEY);
          const parsed = raw ? JSON.parse(raw) : null;
          return typeof parsed?.latitude === 'number' ? parsed : null;
        } catch {
          return null;
        }
      },

      setCoords(latitude, longitude) {
        this.coords = { latitude, longitude };
        this.qibla = qiblaBearing(latitude, longitude);
      },

      // -------------------------------------------------------------- compass

      /**
       * iOS 13+ requires requestPermission() to be called from a user gesture,
       * so the button stays on screen until the user opts in.
       */
      async enableCompass() {
        const DOE = window.DeviceOrientationEvent;

        if (DOE && typeof DOE.requestPermission === 'function') {
          try {
            const result = await DOE.requestPermission();
            if (result !== 'granted') {
              this.compassUnavailable = true;
              this.needsPermission = false;
              return;
            }
          } catch (err) {
            this.compassUnavailable = true;
            this.needsPermission = false;
            console.error('Compass permission error:', err);
            return;
          }
        }

        this.needsPermission = false;
        this.startCompass();
      },

      startCompass() {
        if (!window.DeviceOrientationEvent) {
          this.compassUnavailable = true;
          return;
        }

        this.orientationEvent = 'ondeviceorientationabsolute' in window
          ? 'deviceorientationabsolute'
          : 'deviceorientation';

        window.addEventListener(this.orientationEvent, this.handleOrientation, true);

        // No reading in time means no usable magnetometer — degrade to static mode.
        this.compassTimer = setTimeout(() => {
          if (this.heading === null) this.compassUnavailable = true;
        }, COMPASS_TIMEOUT);
      },

      handleOrientation(event) {
        const heading = headingFromOrientation(event);
        if (heading === null) return;

        this.heading = heading;
        this.compassUnavailable = false;
        clearTimeout(this.compassTimer);
      },

      stopCompass() {
        clearTimeout(this.compassTimer);
        if (this.orientationEvent) {
          window.removeEventListener(this.orientationEvent, this.handleOrientation, true);
          this.orientationEvent = null;
        }
      },
    },
    mounted() {
      this.locate();

      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        this.needsPermission = true;   // iOS — wait for the gesture
      } else {
        this.startCompass();
      }
    },
    beforeUnmount() {
      this.stopCompass();
    }
  }
</script>

<template>
  <the-loading v-if="loading">
    <div class="page-title text-center">
      <img class="w-20 m-auto" src="../assets/images/icons/teenyicons_compass.svg" alt="Kibla Compass">
      <h1 class="text-2xl font-bold mt-3">Kibla Compass</h1>
    </div>
  </the-loading>
  <TheError v-if="error"/>
  <template v-if="!loading && !error">
    <the-header title="Kibla Compass">
      <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="text-sm font-normal">{{ location?.city }}</span>
      </div>
    </the-header>

    <div class="qibla-readout text-center px-5">
      <p class="text-sm text-darkGreen">Qibla direction</p>
      <p class="text-3xl font-bold text-primary">{{ qiblaLabel }}</p>
      <p v-if="isAligned" class="mt-1 text-sm font-semibold text-primary">You are facing the Qibla</p>
    </div>

    <div class="compass-area relative flex items-center justify-center h-80 mt-6 px-5">
      <!-- Dial counter-rotates with the device so N always points at true north. -->
      <img
        class="absolute w-72 transition-transform duration-200 ease-out"
        :style="{ transform: `rotate(${heading === null ? 0 : -heading}deg)` }"
        src="../assets/images/compass.png"
        alt="Compass"
      >
      <img
        class="absolute w-16 transition-transform duration-200 ease-out"
        :style="{ transform: `rotate(${needleRotation}deg) translateY(-6.5rem)` }"
        src="../assets/images/compass-kaaba.png"
        alt="Qibla direction"
      >
    </div>

    <div class="compass-help px-8 pb-10 text-center">
      <button
        v-if="needsPermission"
        @click="enableCompass"
        class="bg-primary text-white px-6 py-3 rounded-full font-semibold"
      >
        Enable compass
      </button>
      <p v-else-if="compassUnavailable" class="text-sm text-darkGreen">
        Your device has no compass sensor. Point the top of your phone to true north,
        then turn {{ qiblaLabel }} clockwise to face the Qibla.
      </p>
      <p v-else-if="heading === null" class="text-sm text-darkGreen">
        Reading compass… move your phone in a figure-eight to calibrate.
      </p>
      <p v-else class="text-sm text-darkGreen">
        Hold your phone flat. The marker points towards the Kaaba.
      </p>
    </div>
  </template>
</template>
