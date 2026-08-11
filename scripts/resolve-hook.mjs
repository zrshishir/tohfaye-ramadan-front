// Maps Vite's "@/" alias to src/, and stubs the Capacitor plugin, so the pure
// scheduling logic can be exercised under plain Node.
export async function resolve(specifier, context, next) {
  if (specifier === '@capacitor/local-notifications') {
    return next(new URL('./stub-local-notifications.mjs', import.meta.url).href, context);
  }
  if (specifier.startsWith('@/')) {
    // Vite resolves extensionless imports; Node does not.
    const rest = specifier.slice(2);
    const withExt = /\.[a-z]+$/.test(rest) ? rest : `${rest}.js`;
    return next(new URL(`../src/${withExt}`, import.meta.url).href, context);
  }
  return next(specifier, context);
}
