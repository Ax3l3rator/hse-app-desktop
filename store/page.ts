import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', () => {
  const page_name = ref('');
  const is_page_loading = ref(false);

  return { page_name, is_page_loading };
});
