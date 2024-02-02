export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuthorized = await window.electronAPI.checkIfAuthorized();

  if (isAuthorized) {
    if (from.meta.layout === 'unauthorized') {
      setPageLayout('default');
    }
  } else {
    setPageLayout('unauthorized');
    if (to.path !== '/unauthorized') {
      return navigateTo('/unauthorized');
    }
  }
});
