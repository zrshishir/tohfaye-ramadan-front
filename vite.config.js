import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  /*
   * Fail the build rather than shipping a bundle that cannot reach the API.
   *
   * .env is git-ignored, and Vite inlines env values at build time. Without this check
   * `npm run build` succeeds, baseURL is compiled in as undefined, and every request in
   * the app silently goes nowhere — the screens render but no data ever arrives, which
   * looks like a backend outage rather than a missing file.
   *
   * Only enforced for builds. `npm run dev` still works without one, falling back to the
   * proxy below.
   */
  if (command === 'build' && !env.VITE_BASE_URL) {
    throw new Error(
      'VITE_BASE_URL is not set, so this build could not talk to the API.\n' +
      '  Run: cp .env.example .env\n' +
      '  Then set VITE_BASE_URL (it must include the /api suffix) and build again.'
    )
  }

  return {
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://tohfa-e-ramazan.test',
          changeOrigin: true,
        }
      }
    }
  }
})
