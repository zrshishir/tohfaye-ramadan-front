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
  <the-header title="Ramadan Calendar">
    <div class="location flex items-start gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">Pabna</span>
    </div>
  </the-header>
  <div class="ramadan-area">
    <div class="ramadan-header text-center py-5">
      <h1 class="text-2xl font-bold">Ramadan - 2024</h1>
      <p class="pt-1">Sheri and Iftar time alart</p>
    </div>
    <div class="ramadan-calendar">
      <div class="calendar-head">
        <div class="content grid grid-cols-5">
          <div class="bg-primary text-white py-3 text-center border-r-2 border-gainsboro">Day</div>
          <div class="bg-primary text-white py-3 text-center border-r-2 border-gainsboro">Date</div>
          <div class="bg-primary text-white py-3 text-center border-r-2 border-gainsboro">Ramadan</div>
          <div class="bg-primary text-white py-3 text-center border-r-2 border-gainsboro">Sheri</div>
          <div class="bg-primary text-white py-3 text-center">Iftar</div>
        </div>
      </div>
      <div class="calendar-body">
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content current-ramadan grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
        <RouterLink to="/ramadan/01" class="content grid grid-cols-5 gap-[1px] border-b border-primary">
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">Tue</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">12 Mar</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">1</div>
          <div class="text-center py-3 font-medium border-r-2 border-gainsboro">04:33 AM</div>
          <div class="text-center py-3 font-medium">06:10 PM</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>