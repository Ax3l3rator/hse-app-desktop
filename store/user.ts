import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const email = ref('');
  const full_name = ref('');
  const avatar_url = ref('');
  return { email, full_name, avatar_url };
});
