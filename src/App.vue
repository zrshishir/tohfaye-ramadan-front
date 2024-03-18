<script>
  import { App as CapacitorApp } from '@capacitor/app';
  export default {
    mounted() {
      CapacitorApp.addListener('backButton', () => {
        this.handleBackButton();
      });
    },
    methods: {
      handleBackButton() {
        if (this.$route.path !== '/') {
          this.$router.go(-1);
        } else {
          CapacitorApp.exitApp();
        }
      }
    }
  }
</script>

<template>
  <RouterView/>
</template>