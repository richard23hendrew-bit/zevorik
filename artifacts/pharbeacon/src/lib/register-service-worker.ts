export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL;
    void navigator.serviceWorker.register(`${basePath}sw.js`, { scope: basePath }).catch(() => {
      // A failed registration must not interrupt the normal browser experience.
    });
  });
}