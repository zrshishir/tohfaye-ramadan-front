import { createRouter, createWebHistory } from 'vue-router';

import HomeVue from "@/screens/Home.vue";
import TasbihVue from '@/screens/Tasbih.vue';
import TimeVue from '@/screens/time/index.vue';
import AlQuraan from "@/screens/alquraan/index.vue";
import SahreeIftarVue from '@/screens/SahreeIftar.vue';
import AsmaUlHusnaVue from "@/screens/AsmaUlHusna.vue";
import KiblaCompassVue from '@/screens/KiblaCompass.vue';
import AllSurahVue from "@/screens/alquraan/AllSurah.vue";
import SalatTimesVue from '@/screens/time/SalatTimes.vue';
import SalarScheduleVue from '@/screens/SalarSchedule.vue';
import UpComingTimeVue from '@/screens/time/UpComingTime.vue';
import SingleSurahVue from "@/screens/alquraan/SingleSurah.vue";
import TomorrowTimesVue from '@/screens/time/TomorrowTimes.vue';

const routes = [
  { path: '/', component: HomeVue },
  { 
    path: '/time', 
    component: TimeVue,
    children: [
      { path: 'next-salat', component: SalatTimesVue },
      { path: 'present-time', component: SalatTimesVue },
      { path: 'tomorrow-salat', component: TomorrowTimesVue },
      { path: 'upcoming-time', component: UpComingTimeVue },
    ],
  },
  { path: '/tasbih', component: TasbihVue },
  { 
    path: '/al-quraan', 
    component: AlQuraan,
    children: [
      { path: '', name: 'al-quraan', component: AllSurahVue },
      { path: ':id', component: SingleSurahVue }
    ],
  },
  { path: '/sahree-iftar', component: SahreeIftarVue },
  { path: '/asma-ul-husna', component: AsmaUlHusnaVue },
  { path: '/kibla-compass', component: KiblaCompassVue },
  { path: '/salar-schedule', component: SalarScheduleVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // If navigating to /time/upcoming-time, scroll to the top
  if (to.path) {
    window.scrollTo(0, 0);
  }
  next();
});


export default router;