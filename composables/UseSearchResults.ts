export default function () {
  const results = ref<any[]>([]);
  window.ipcBridge.onSearchResults((res) => {
    results.value = res;
  });
  return results;
}
