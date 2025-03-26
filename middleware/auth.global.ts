export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuthorized = await window.ipcBridge.checkIfAuthorized();

  if (isAuthorized) {
    if (from.meta.layout === 'unauthorized') {
      setPageLayout('default');
    }
  } else {
    if (to.path !== '/unauthorized') {
      return navigateTo('/unauthorized');
    }
  }
});
