import { createRouter, createWebHistory } from 'vue-router';

import HomeVue from "@/screens/Home.vue";
import TasbihVue from '@/screens/Tasbih.vue';
import TimeVue from '@/screens/time/index.vue';
import AlQuraanVue from "@/screens/AlQuraan.vue";
import SahreeIftarVue from '@/screens/SahreeIftar.vue';
import AsmaUlHusnaVue from "@/screens/AsmaUlHusna.vue";
import KiblaCompassVue from '@/screens/KiblaCompass.vue';
import SalatTimesVue from '@/screens/time/SalatTimes.vue';
import SalarScheduleVue from '@/screens/SalarSchedule.vue';

const routes = [
  { path: '/', component: HomeVue },
  { 
    path: '/time', 
    component: TimeVue,
    children: [
      { path: 'present-time', component: SalatTimesVue },
      { path: 'next-salat', component: SalatTimesVue }
    ],
  },
  { path: '/tasbih', component: TasbihVue },
  { path: '/al-quraan', component: AlQuraanVue },
  { path: '/sahree-iftar', component: SahreeIftarVue },
  { path: '/asma-ul-husna', component: AsmaUlHusnaVue },
  { path: '/kibla-compass', component: KiblaCompassVue },
  { path: '/salar-schedule', component: SalarScheduleVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;