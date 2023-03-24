<template>
  <v-card>
    <v-layout>
      <v-app-bar title="Application bar"></v-app-bar>

      <v-navigation-drawer color="surface">
        <v-list>
          <v-list-item title="Drawer left"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer color="surface" location="right">
        <v-list>
          <v-list-item title="Drawer right"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="min-height: 300px;">
        <RozaCalendar />
      </v-main>
      
    </v-layout>
  </v-card>
</template>

<script>
import RozaCalendar from './views/roza_calendars/RozaCalendar.vue';
export default {
  components: {
    RozaCalendar
  },
  data: () => ({
    links: [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Blog',
      'Contact Us',
    ],
  }),
}
</script>