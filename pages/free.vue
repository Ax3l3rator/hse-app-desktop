<template>
  <v-container fluid class="pa-0 py-2 mt-2">
    <v-row>
      <v-col cols="3">
        <v-select
          label="Кампус"
          variant="outlined"
          :items="campuses"
          item-title="name"
          item-value="id"
          return-object
          v-model="selectedCampus"
        >
        </v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selected"
          variant="outlined"
          :items="itemsFiltered"
          item-title="name"
          item-value="id"
          label="Здание"
          return-object
        >
        </v-select>
      </v-col>
      <v-col cols="3">
        <v-menu
          activator="#dateActivator"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          width="360"
          max-width="360"
          contained
          style="width: 360 !important"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedDate"
              id="dateActivator"
              variant="outlined"
              append-inner-icon="mdi-calendar"
              readonly
              class="cursor-pointer"
              v-bind="props"
              label="Дата"
            >
            </v-text-field>
          </template>
          <v-date-picker
            width="360"
            :min="currentDate"
            :max="maxDate"
            v-model="date"
            no-title
            scrollable
            color="primary"
            style="width: 100%"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-range-slider v-model="rng" min="1" max="7" step="1" label="Интервал пар" thumb-label="always" color="blue">
          <template #append>
            <div class="text-medium-emphasis pl-3">
              {{ Intl.DateTimeFormat('ru-RU', { timeStyle: 'short' }).format(dateFrom) }}-{{
                Intl.DateTimeFormat('ru-RU', { timeStyle: 'short' }).format(dateTo)
              }}
            </div>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-list v-if="auditoriums" class="rounded-lg">
          <div v-for="(_, group, index) in auditoriums">
            <v-list-subheader>
              <div v-if="group != 'any'">КОРПУС {{ group }}</div>
              <div v-else>ДРУГОЕ</div>
            </v-list-subheader>
            <v-divider></v-divider>
            <div v-for="(room, i) in auditoriums[group]">
              <v-list-item>
                <v-list-item-title>
                  {{ room.room }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ room.auditorium_type }}
                </v-list-item-subtitle>
                <v-divider
                  class="mt-2"
                  v-if="i != auditoriums[group].length - 1 && index != Object.keys(auditoriums).length - 1"
                ></v-divider>
              </v-list-item>
            </div>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { BuildingGrouped } from '~/types/buildings';

const menu = ref();
const date = ref(new Date());
const selected = ref();
const formattedDate = computed(() => {
  return Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' }).format(date.value);
});

const currentDate = ref(new Date(new Date().setHours(0, 0, 0, 0)));
const maxDate = computed(() => {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
});

const dateTo = computed(() => {
  return new Date(new Date(date.value).setHours(pairToTime[rng.value[1]][1][0], pairToTime[rng.value[1]][1][1], 0));
});

const dateFrom = computed(() => {
  return new Date(new Date(date.value).setHours(pairToTime[rng.value[0]][0][0], pairToTime[rng.value[0]][0][1], 0));
});

const buildings = ref<BuildingGrouped[]>();

const campuses = ref([
  {
    id: 'CAMPUS_MOS',
    name: 'Москва',
  },
  {
    id: 'CAMPUS_SPB',
    name: 'Санкт-Петербург',
  },
  {
    id: 'CAMPUS_NNOV',
    name: 'Нижний Новгород',
  },
  {
    id: 'CAMPUS_PERM',
    name: 'Пермь',
  },
]);
const selectedCampus = ref(campuses.value[0]);

const itemsFiltered = computed(() => {
  const filtered = buildings.value
    ?.filter((item) => {
      return item.campus == selectedCampus.value.id;
    })
    .flatMap(({ buildings }) => {
      return buildings.map(({ id, name }) => {
        return { id, name };
      });
    });
  if (filtered) {
    selected.value = filtered[0];
  }
  return filtered;
});

const rng = ref([1, 7]);

const pairToTime: { [key: number]: [[number, number], [number, number]] } = {
  1: [
    [9, 30],
    [10, 50],
  ],
  2: [
    [11, 10],
    [12, 30],
  ],
  3: [
    [13, 0],
    [14, 20],
  ],
  4: [
    [14, 40],
    [16, 0],
  ],
  5: [
    [16, 20],
    [17, 40],
  ],
  6: [
    [18, 10],
    [19, 30],
  ],
  7: [
    [19, 40],
    [21, 0],
  ],
};

const auditoriums = UseFreeAuditoriums();
const loading = ref(true);

let timeout: NodeJS.Timeout;

watch([selected, selectedCampus, date, rng], async ([selected, selectedCampus, date]) => {
  clearTimeout(timeout);
  loading.value = true;
  timeout = setTimeout(async () => {
    await window.electronAPI.getFreeAuditoriums(selected?.id, dateFrom.value.toISOString(), dateTo.value.toISOString());
  }, 1000);
});

watch(auditoriums, async (auditoriums) => {
  loading.value = false;
});

onBeforeMount(async () => {
  buildings.value = await window.electronAPI.getBuildings();
});
</script>
<style></style>
