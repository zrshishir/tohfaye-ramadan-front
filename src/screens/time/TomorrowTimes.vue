<script>
  import TheHeader from '@/components/TheHeader.vue';
  import TheSchedule from '@/components/TheSchedule.vue';

  export default {
    components: {
      TheHeader,
      TheSchedule
    }
  } 
</script>

<template>
  <the-header title="Tomorrow Schedule">
    <div class="location flex items-center gap-1 px-3 py-1 border-2 border-solid border-primary rounded-3xl	">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <span class="text-sm font-normal">Pabna</span>
    </div>
  </the-header>
  <TheSchedule/>
</template>