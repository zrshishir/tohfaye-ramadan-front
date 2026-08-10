# namaj-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
cp .env.example .env
```

`.env` is git-ignored. Set `VITE_BASE_URL` to the API you want to build against — it must
include the `/api` suffix. Vite inlines env values at **build** time, so after changing
`.env` you must rebuild (`npm run build`) and re-sync the native apps (`./update_mobile_app.sh`);
restarting the app alone will not pick up the new value.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
