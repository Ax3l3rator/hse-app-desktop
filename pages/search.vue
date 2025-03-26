<template>
  <v-container max-width="1280">
    <v-row no-gutters>
      <v-col cols="4" class="pr-2">
        <v-select
          density="comfortable"
          hide-details="auto"
          v-model="select"
          return-object
          variant="outlined"
          :items="items"
          item-title="name"
          item-value="type"
          placeholder="Категория"
          label="Категория"
          rounded="lg"
        >
        </v-select>
      </v-col>
      <v-col cols="8" class="pl-2">
        <v-text-field
          density="comfortable"
          hide-details="auto"
          v-model.lazy="searchQuery"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Поиск"
          rounded="lg"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list v-if="searchResults.length" class="pa-0 rounded-lg" lines="three">
          <div v-for="(res, i) in searchResults">
            <v-list-item
              :to="['STUDENT', 'STAFF', 'EXTERNAL_STAFF'].includes(res.type) ? `/${linksByType[res.type as SearchType]}/${res.email}`: undefined"
            >
              <v-list-item-title v-if="['STUDENT', 'STAFF', 'EXTERNAL_STAFF'].includes(res.type)">
                {{ res.full_name }}
              </v-list-item-title>
              <v-list-item-title v-else-if="['GROUP'].includes(res.type)">
                {{ res.label }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ res.room }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="res.type !== 'AUDITORIUM'">
                {{ res.description }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                {{ res.auditorium_type }}
              </v-list-item-subtitle>
              <template v-slot:prepend>
                <v-avatar :color="!res.avatar_url ? 'primary' : ''" size="large">
                  <v-icon v-if="!res.avatar_url" :icon="iconsByType[res.type as SearchType]"></v-icon>
                  <v-img draggable="false" v-else :src="res.avatar_url"> </v-img>
                </v-avatar>
              </template>
            </v-list-item>
            <v-divider v-if="i != searchResults.length - 1"></v-divider>
          </div>
        </v-list>
        <v-empty-state
          v-else
          :title="searchQuery.length && !is_before_loading ? 'Результатов нет' : 'Начните искать'"
          :text="
            searchQuery.length && !is_before_loading
              ? 'Попробуйте ввести что-то другое'
              : 'Введите что-нибудь в поле поиска'
          "
          :icon="searchQuery.length && !is_before_loading ? 'mdi-account-alert-outline' : 'mdi-account-search-outline'"
        >
        </v-empty-state>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { usePageStore } from '~/store/page';
import type { SearchType } from '~/types/search';

usePageStore().page_name = 'Поиск';

const select = ref<{ name: string; type: SearchType }>({ name: 'Все', type: 'ALL' });

const searchResults = ref(UseSearchResults());
const searchQuery = ref<string>('');

const iconsByType: { [key in SearchType]: string } = {
  STUDENT: 'mdi-account',
  STAFF: 'mdi-account-school-outline',
  EXTERNAL_STAFF: 'mdi-account',
  AUDITORIUM: 'mdi-door',
  GROUP: 'mdi-account-multiple',
  ALL: '',
};

const linksByType: { [key in SearchType]: string } = {
  STUDENT: 'students',
  STAFF: 'teachers',
  EXTERNAL_STAFF: 'teachers',
  AUDITORIUM: 'auditoriums',
  GROUP: 'mdi-account-multiple',
  ALL: '',
};

const items = ref<{ name: string; type: SearchType }[]>([
  { name: 'Все', type: 'ALL' },
  { name: 'Студент', type: 'STUDENT' },
  { name: 'Группа', type: 'GROUP' },
  { name: 'Преподаватель', type: 'STAFF' },
  { name: 'Аудитория', type: 'AUDITORIUM' },
]);

const { is_page_loading } = storeToRefs(usePageStore());
is_page_loading.value = false;
const is_before_loading = ref(false);

let timeout: NodeJS.Timeout;
watch([searchQuery, select], ([query, selected]) => {
  is_before_loading.value = true;
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    is_page_loading.value = true;
    await window.ipcBridge.getSearchResults(query, selected.type);
  }, 700);
});

watch(searchResults, (searchResults) => {
  is_page_loading.value = false;
  is_before_loading.value = false;
});
</script>
