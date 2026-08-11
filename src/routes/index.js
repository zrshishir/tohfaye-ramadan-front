import { createRouter, createWebHistory } from 'vue-router';
import Navigo from 'navigo';

// Import your Vue components
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

// New routes
import MasalaVue from '@/screens/Masala.vue';
import SettingsVue from '@/screens/Settings.vue';

// Hadith library
import HadithVue from '@/screens/hadith/index.vue';
import HadithBooksVue from '@/screens/hadith/Books.vue';
import HadithChaptersVue from '@/screens/hadith/Chapters.vue';
import HadithListVue from '@/screens/hadith/Hadiths.vue';
import SingleHadithVue from '@/screens/hadith/SingleHadith.vue';

// Create a router instance
const vueRouter = createRouter({
  history: createWebHistory(),
  routes: [
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
    {
      path: '/hadith',
      component: HadithVue,
      children: [
        { path: '', name: 'hadith', component: HadithBooksVue },
        // Static segments are declared before the :bookId param so they win the match.
        { path: 'search', component: HadithListVue },
        { path: 'detail/:id', component: SingleHadithVue },
        { path: ':bookId', component: HadithChaptersVue },
        { path: ':bookId/:chapterId', component: HadithListVue },
      ],
    },
    { path: '/masala', component: MasalaVue },
    { path: '/settings', component: SettingsVue },
  ],
});

// Initialize Navigo
const navigoRouter = new Navigo(window.location.origin);

// Define routes for Navigo
const routes = vueRouter.getRoutes().map(route => ({
  path: route.path,
  handler: () => {
    vueRouter.push(route.path).catch(() => {});
  },
}));

// Add handler for the root path ("/")
routes.push({
  path: '/',
  handler: () => {
    vueRouter.push('/').catch(() => {});
  },
});

// Loop through routes and add them to Navigo router
routes.forEach(route => {
  navigoRouter.on(route.path, route.handler);
});

// Start Navigo router
navigoRouter.resolve();

// Before each route change, scroll to top
vueRouter.beforeEach((to, from, next) => {
  if (to.path) {
    window.scrollTo(0, 0);
  }
  next();
});

export default vueRouter;
