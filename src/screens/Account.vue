<script>
  import { getAuth, isSignedIn, login, register, logout, deleteAccount } from '@/services/auth';
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { TheHeader },
    data() {
      return {
        mode: 'login',            // login | register
        form: { name: '', email: '', password: '', passwordConfirmation: '' },
        confirmDelete: false,
        deletePassword: '',
        busy: false,
        error: null,
        user: getAuth().user,
      }
    },
    computed: {
      signedIn() {
        return isSignedIn();
      },
      canSubmit() {
        const { name, email, password, passwordConfirmation } = this.form;
        if (!email.trim() || !password) return false;
        if (this.mode === 'register') {
          return Boolean(name.trim()) && password.length >= 8 && password === passwordConfirmation;
        }
        return true;
      },
    },
    methods: {
      /** Prefer the server's per-field message over the generic one. */
      messageFrom(error) {
        const fields = error?.errors;
        if (fields) return Object.values(fields).flat()[0];
        return error?.appMessage ?? 'Something went wrong.';
      },

      async submit() {
        this.busy = true;
        this.error = null;

        try {
          this.user = this.mode === 'register'
            ? await register(this.form)
            : await login({ email: this.form.email, password: this.form.password });

          this.form = { name: '', email: '', password: '', passwordConfirmation: '' };
        } catch (error) {
          this.error = this.messageFrom(error);
        } finally {
          this.busy = false;
        }
      },

      async signOut() {
        this.busy = true;
        await logout();
        this.user = null;
        this.busy = false;
      },

      async removeAccount() {
        this.busy = true;
        this.error = null;

        try {
          await deleteAccount(this.deletePassword);
          this.user = null;
          this.confirmDelete = false;
          this.deletePassword = '';
        } catch (error) {
          this.error = this.messageFrom(error);
        } finally {
          this.busy = false;
        }
      },
    },
  }
</script>

<template>
  <TheHeader title="Account"/>

  <div class="account-area px-5 py-4">
    <!-- Signed out -->
    <template v-if="!signedIn">
      <div class="intro bg-white shadow-3xl rounded-2xl p-4 mb-4">
        <h3 class="text-base font-bold pb-1">Why sign in?</h3>
        <p class="text-sm text-darkGreen">
          An account is optional. Everything works without one — signing in just carries
          your bookmarks and tasbih counts to your other devices.
        </p>
      </div>

      <div class="form bg-white shadow-3xl rounded-2xl p-4">
        <div class="flex gap-2 pb-4">
          <button
            v-for="tab in [{ id: 'login', label: 'Sign in' }, { id: 'register', label: 'Create account' }]"
            :key="tab.id"
            @click="mode = tab.id; error = null"
            :class="[
              'flex-1 py-2 rounded-2xl text-sm font-semibold border-2',
              mode === tab.id ? 'bg-primary text-white border-primary' : 'text-primary border-gainsboro'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <form @submit.prevent="submit">
          <input
            v-if="mode === 'register'"
            v-model="form.name"
            type="text"
            placeholder="Your name"
            class="w-full mb-3 px-4 py-2 border-2 border-gainsboro rounded-2xl outline-none focus:border-primary"
          >
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="Email"
            class="w-full mb-3 px-4 py-2 border-2 border-gainsboro rounded-2xl outline-none focus:border-primary"
          >
          <input
            v-model="form.password"
            type="password"
            :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
            placeholder="Password"
            class="w-full mb-3 px-4 py-2 border-2 border-gainsboro rounded-2xl outline-none focus:border-primary"
          >
          <input
            v-if="mode === 'register'"
            v-model="form.passwordConfirmation"
            type="password"
            autocomplete="new-password"
            placeholder="Confirm password"
            class="w-full mb-1 px-4 py-2 border-2 border-gainsboro rounded-2xl outline-none focus:border-primary"
          >
          <p v-if="mode === 'register'" class="text-xs text-darkGreen pb-3">
            At least 8 characters.
          </p>

          <p v-if="error" class="text-sm text-red-600 pb-3">{{ error }}</p>

          <button
            type="submit"
            :disabled="!canSubmit || busy"
            class="w-full bg-primary text-white py-3 rounded-2xl font-semibold disabled:opacity-50"
          >
            {{ busy ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Sign in') }}
          </button>
        </form>
      </div>
    </template>

    <!-- Signed in -->
    <template v-else>
      <div class="profile bg-white shadow-3xl rounded-2xl p-4 mb-4">
        <p class="text-xs text-darkGreen">Signed in as</p>
        <p class="text-lg font-bold text-primary">{{ user?.name }}</p>
        <p class="text-sm text-darkGreen">{{ user?.email }}</p>
        <p class="text-xs text-darkGreen pt-3">
          Your bookmarks and tasbih counts sync to this account.
        </p>
      </div>

      <button
        @click="signOut"
        :disabled="busy"
        class="w-full mb-3 py-3 rounded-2xl font-semibold text-primary border-2 border-primary disabled:opacity-50"
      >
        Sign out
      </button>

      <div class="danger bg-white shadow-3xl rounded-2xl p-4 mb-8">
        <h3 class="text-base font-bold pb-1">Delete account</h3>
        <p class="text-sm text-darkGreen pb-3">
          This permanently removes your account and everything synced to it. It cannot be
          undone.
        </p>

        <template v-if="!confirmDelete">
          <button @click="confirmDelete = true" class="text-sm text-red-600 font-semibold">
            Delete my account
          </button>
        </template>

        <template v-else>
          <input
            v-model="deletePassword"
            type="password"
            autocomplete="current-password"
            placeholder="Confirm your password"
            class="w-full mb-3 px-4 py-2 border-2 border-gainsboro rounded-2xl outline-none focus:border-red-600"
          >
          <p v-if="error" class="text-sm text-red-600 pb-3">{{ error }}</p>
          <div class="flex gap-2">
            <button
              @click="confirmDelete = false; error = null"
              class="flex-1 py-2 rounded-2xl text-sm font-semibold text-primary border-2 border-gainsboro"
            >
              Cancel
            </button>
            <button
              @click="removeAccount"
              :disabled="!deletePassword || busy"
              class="flex-1 py-2 rounded-2xl text-sm font-semibold bg-red-600 text-white disabled:opacity-50"
            >
              Delete permanently
            </button>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
