<script>
  import { RouterLink } from 'vue-router';
  import { getReaderSettings, toggleBookmark } from '@/services/reader';
  import { isSignedIn } from '@/services/auth';
  import api from '@/services/api';
  import TheHeader from '@/components/TheHeader.vue';
  import TheNoData from '@/components/TheNoData.vue';

  export default {
    components: { TheHeader, TheNoData },
    data() {
      return {
        bookmarks: getReaderSettings().bookmarks ?? [],
        signedIn: isSignedIn(),
      }
    },
    methods: {
      async remove(bookmark) {
        toggleBookmark(bookmark);
        this.bookmarks = getReaderSettings().bookmarks ?? [];

        // Mirror the removal to the account, if there is one. Best-effort: the local
        // list is the source of truth for what the user sees.
        if (this.signedIn) {
          try {
            await api.delete(`/bookmarks/${bookmark.ayatId}`);
          } catch (error) {
            console.error('Could not remove the bookmark from your account:', error);
          }
        }
      },
      readableDate(at) {
        if (!at) return '';
        return new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      },
    },
  }
</script>

<template>
  <TheHeader title="Bookmarks"/>

  <div class="bookmarks-area px-5 py-4">
    <p v-if="!signedIn && bookmarks.length" class="text-xs text-darkGreen pb-3">
      These are saved on this device. Sign in to keep them across devices.
    </p>

    <TheNoData v-if="!bookmarks.length"/>

    <div v-else>
      <div
        v-for="bookmark in bookmarks"
        :key="bookmark.ayatId"
        class="bookmark mb-3 p-4 bg-white shadow-3xl rounded-2xl flex items-center justify-between gap-3"
      >
        <RouterLink
          :to="`/al-quraan/${bookmark.suraName}/-/-/-/${bookmark.suraId}?page=${bookmark.page || 1}`"
          class="flex-1"
        >
          <p class="text-base font-bold">{{ bookmark.suraName || 'Al-Quraan' }}</p>
          <p class="text-sm text-darkGreen">Ayat {{ bookmark.ayatNo }}</p>
          <p v-if="bookmark.at" class="text-xs text-darkGreen pt-1">
            Saved {{ readableDate(bookmark.at) }}
          </p>
        </RouterLink>

        <button
          @click="remove(bookmark)"
          aria-label="Remove bookmark"
          class="text-secondary text-xl shrink-0 px-2"
        >
          &#9733;
        </button>
      </div>
    </div>
  </div>
</template>
