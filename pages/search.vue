<template>
  <v-container fluid class="pa-0 py-2 mt-2">
    <v-row no-gutters>
      <v-col cols="4" class="pr-2">
        <v-select
          v-model="select"
          return-object
          variant="outlined"
          :items="items"
          item-title="name"
          item-value="type"
          placeholder="Категория"
          label="Категория"
        >
        </v-select>
      </v-col>
      <v-col cols="8" class="pl-2">
        <v-text-field
          v-model.lazy="searchQuery"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Поиск"
          :loading="loading"
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { SearchType } from '~/types/search';

const select = ref<{ name: string; type: SearchType }>({ name: 'Все', type: 'ALL' });

const searchResults = ref(UseSearchResults());
const searchQuery = ref<string>('');

const iconsByType: { [key in SearchType]: string } = {
  STUDENT: 'mdi-account',
  STAFF: 'mdi-account',
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

const loading = ref(false);

let timeout: NodeJS.Timeout;
watch([searchQuery, select], ([query, selected]) => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    loading.value = true;
    await window.electronAPI.getSearchResults(query, selected.type);
  }, 700);
});

watch(searchResults, (searchResults) => {
  loading.value = false;
});
</script>
