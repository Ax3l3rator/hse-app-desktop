export default function () {
  const results = ref<any[]>([]);
  window.electronAPI.onSearchResults((res) => {
    results.value = res;
  });
  return results;
}
