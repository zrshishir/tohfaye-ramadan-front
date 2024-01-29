<script>
  import { RouterLink } from 'vue-router';
  
  export default {
    
  }
</script>

<template>
  
  <div class="namaj-options pt-7 grid grid-cols-3 gap-5 gap-y-10">
    <RouterLink to="/al-quraan" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/quraan.svg" alt="mosque">
      <p class="pt-2 font-light text-center">Al-Quraan</p>
    </RouterLink>
    <RouterLink to="/duas" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/dua.svg" alt="mosque">
      <p class="pt-2 font-light text-center">Duas</p>
    </RouterLink>
    <RouterLink to="/sahree-iftar" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/moon.svg" alt="mosque">
      <p class="pt-2 font-light text-center">Sahree - Iftar</p>
    </RouterLink>
    <RouterLink to="/tasbih" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/tasbih.svg" alt="mosque">
      <p class="pt-2 font-light text-center">Tasbih</p>
    </RouterLink>
    <RouterLink to="/kibla-compass" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/teenyicons_compass.svg" alt="mosque">
      <p class="pt-2 font-light text-center">Kibla Compass</p>
    </RouterLink>
    <RouterLink to="/asma-ul-husna" class="option flex flex-col items-center justify-center">
      <img class="w-7 h-7 object-contain object-center" src="@/assets/images/icons/asma-ul-husna.png" alt="mosque">
      <p class="pt-2 font-light text-center">Asma-Ul-Husna</p>
    </RouterLink>
  </div>
</template>