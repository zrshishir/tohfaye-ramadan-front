<template>
  <div class="min-h-screen bg-sand text-primary p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 gold-text">Daily Hadith</h1>
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="dot w-8 h-8 bg-secondary rounded-full"></div>
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        Failed to load Hadith. Please try again.
      </div>
      <div v-else class="grid gap-6">
        <div v-for="hadith in hadiths" :key="hadith.id" class="glass-panel p-6">
          <p class="text-lg leading-relaxed mb-4 text-darkGreen">
            {{ hadith.text }}
          </p>
          <div class="text-right text-sm text-gray-600">
            - {{ hadith.narrator }} ({{ hadith.source }})
          </div>
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
      hadiths: [],
      loading: true,
      error: false
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/api/hadith');
      this.hadiths = response.data;
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
</script>
