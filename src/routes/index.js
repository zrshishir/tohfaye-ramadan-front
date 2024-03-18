import { createRouter, createWebHistory } from 'vue-router';

import HomeVue from "@/screens/Home.vue";
import Duas from "@/screens/duas/index.vue";
import TasbihVue from '@/screens/Tasbih.vue';
import TimeVue from '@/screens/time/index.vue';
import AlQuraan from "@/screens/alquraan/index.vue";
import RamadanVue from '@/screens/ramadan/index.vue';
import CategoryVue from '@/screens/duas/Category.vue';
import AsmaUlHusnaVue from "@/screens/AsmaUlHusna.vue";
import KiblaCompassVue from '@/screens/KiblaCompass.vue';
import AllSurahVue from "@/screens/alquraan/AllSurah.vue";
import SalatTimesVue from '@/screens/time/SalatTimes.vue';
import SingleDuasVue from '@/screens/duas/SingleDuas.vue';
import UpComingTimeVue from '@/screens/time/UpComingTime.vue';
import CategoryDuasVue from '@/screens/duas/CategoryDuas.vue';
import SingleSurahVue from "@/screens/alquraan/SingleSurah.vue";
import TomorrowTimesVue from '@/screens/time/TomorrowTimes.vue';
import CalendarVue from '@/screens/ramadan/Calendar.vue';
import SingleDateVue from '@/screens/ramadan/SingleDate.vue';

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
      { path: ':name/:nameArabic/:type/:ayatCount/:id', component: SingleSurahVue }
    ],
  },
  {
    path: '/duas', 
    component: Duas, 
    children: [
      { path: '', name: 'duas', component: CategoryVue },
      { path: 'category-duas/:title/:id', component: CategoryDuasVue },
      { path: ':id', component: SingleDuasVue }
    ],
  },
  { 
    path: '/ramadan', 
    component: RamadanVue,
    children: [
      { path: '', name: 'ramadan', component: CalendarVue },
      { path: ':id', component: SingleDateVue },
    ],
  },
  { path: '/asma-ul-husna', component: AsmaUlHusnaVue },
  { path: '/kibla-compass', component: KiblaCompassVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path) {
    window.scrollTo(0, 0);
  }
  next();
});

export default router;
