<script>
  import { RouterLink } from 'vue-router';
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { 
      TheHeader 
    }
  }
</script>

<template>
  <TheHeader title="Al-Quraan"/>
  <div class="tasbih-area px-5 py-3">
    <div class="relative">
      <select class="block appearance-none w-full bg-white border border-primary px-4 py-2 pr-8 rounded-full focus:outline-none focus:shadow-outline">
        <option>Select Your Surah</option>
        <option>Al-Fatiha (الفاتحة)</option>
        <option>Al-Baqara (البقرة)</option>
        <option>Al-Imran (آل عمران)</option>
        <option>An-Nisa (النّساء)</option>
        <option>Al-Ma’idah (المائدة)</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10 12.586l4.293-4.293 1.414 1.414L10 15.414l-5.707-5.707 1.414-1.414z"/>
        </svg>
      </div>
    </div>
    <div class="surahs mt-5">
      <RouterLink :to="`/al-quraan/${1}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">01</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Fatiha - 7</p>
            <p class="text-sm">আল- ফাতিহা (সূচনা)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">الفاتحة</p>
          <p class="text-sm">Makki</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${2}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">02</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Baqara - 286</p>
            <p class="text-sm">আল- বাকার (গাভী)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">البقرة</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${3}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">03</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Imran - 200</p>
            <p class="text-sm">আল- ইমরান (ইমরান পরিবার)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">آل عمران</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${4}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">04</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">An-Nisa - 176</p>
            <p class="text-sm">আল-মায়িদাহ (টেবিল)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">المائدة</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${5}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">05</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Ma’idah - 120</p>
            <p class="text-sm">আল-মায়িদাহ (টেবিল)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">المائدة</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${6}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">06</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-An'am - 165</p>
            <p class="text-sm">সূরা আনআম(গৃৃহপালিত পশু)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">الانعام</p>
          <p class="text-sm">Macci</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${7}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">07</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Araf - 206</p>
            <p class="text-sm">সূরা আরাফ (উচু স্থানসমূহ)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">الأعراف</p>
          <p class="text-sm">Macci</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${8}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">08</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">Al-Anfal - 75</p>
            <p class="text-sm">সূরা আনফাল (যুদ্ধে-লব্ধ ধনসম্পদ)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">الأنفال</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
      <RouterLink :to="`/al-quraan/${9}`" class="surah flex items-center justify-between border border-primary rounded-xl p-3 my-3">
        <div class="content flex items-center gap-3">          
          <div class="number w-10 h-10 bg-union bg-no-repeat bg-center bg-cover flex items-center justify-center">
            <span class="text-white font-bold">09</span>
          </div>
          <div class="text-en">
            <p class="text-lg font-bold">At-Tawba - 129</p>
            <p class="text-sm">সূরা তাওবাহ্‌ (অনুশোচনা)</p>
          </div>
        </div>
        <div class="text-ar text-right">
          <p class="text-xl font-bold">التوبة</p>
          <p class="text-sm">Madani</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>