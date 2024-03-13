<script>
  import { RouterLink } from 'vue-router';
  export default {

  }
</script>

<template>
  <RouterLink to="https://www.facebook.com/prayerpulse" class="social-media mt-3 py-3 px-4 rounded-lg bg-primary flex items-center justify-between gap-3">
    <img class="w-16" src="@/assets/images/logo.svg" alt="social-logo">
    <p class="text-xs text-center text-white">Join our Facebook page to give your original feedback about the app.</p>
    <a href="https://www.facebook.com/prayerpulse" class="bg-white px-3 py-2 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4 text-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </a>
  </RouterLink>
</template>