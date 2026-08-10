<template>
  <div class="min-h-screen bg-sand text-primary p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 gold-text">Islamic Mas-ala</h1>
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="dot w-8 h-8 bg-secondary rounded-full"></div>
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        Failed to load Mas-ala. Please try again.
      </div>
      <div v-else class="grid gap-6">
        <div v-for="item in masalas" :key="item.id" class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-3 text-primary">{{ item.question }}</h2>
          <p class="text-md leading-relaxed text-darkGreen">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      masalas: [],
      loading: true,
      error: false
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/api/masala');
      this.masalas = response.data;
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
</script>
