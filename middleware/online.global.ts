export default defineNuxtRouteMiddleware(async (to, from) => {
  // const isOnline = await window.ipcBridge.isOnline();
  // const offline_list = ['/grades', '/rating', '/', '/cafes', '/search'];
  // if (isOnline && from.meta.layout === 'default') {
  //   setPageLayout('offline');
  //   if (offline_list.includes(to.path)) {
  //     return navigateTo(`/local${to.path}`);
  //   }
  //   return navigateTo('/local/');
  // } else if (!isOnline) {
  //   return setPageLayout('default');
  // } else {
  //   return setPageLayout('offline');
  // }
});
