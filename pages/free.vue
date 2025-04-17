<template>
  <v-container max-width="1280">
    <v-row>
      <v-col cols="3">
        <v-select
          density="comfortable"
          hide-details="auto"
          :items="campuses"
          item-title="name"
          item-value="id"
          label="Кампус"
          rounded="lg"
          return-object
          variant="outlined"
          v-model="selectedCampus"
        >
        </v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          density="comfortable"
          v-model="selected"
          variant="outlined"
          :items="itemsFiltered"
          item-title="name"
          rounded="lg"
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
          contained
          rounded="lg"
        >
          <template #activator="{ props }">
            <v-text-field
              density="comfortable"
              v-model="formattedDate"
              id="dateActivator"
              variant="outlined"
              readonly
              class="cursor-pointer"
              :class="mdAndUp ? '' : 'small-centered'"
              v-bind="props"
              label="Дата"
              rounded="lg"
            >
            </v-text-field>
          </template>
          <v-date-picker
            :min="currentDate"
            :max="maxDate"
            v-model="date"
            no-title
            scrollable
            class="mt-2"
            color="primary"
            style="width: 100%"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-range-slider
          v-model="rng"
          min="1"
          max="7"
          step="1"
          label="Интервал занятий:"
          hide-details="auto"
          thumb-label="always"
          density="comfortable"
          color="primary"
        >
          <template #append>
            <div class="opacity-60 pl-3">
              {{ Intl.DateTimeFormat('ru-RU', { timeStyle: 'short' }).format(dateFrom) }}-{{
                Intl.DateTimeFormat('ru-RU', { timeStyle: 'short' }).format(dateTo)
              }}
            </div>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <!-- <v-divider class="mb-2"></v-divider> -->
    <v-row justify="center" align="center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-card v-if="auditoriums && Object.keys(auditoriums).length" variant="outlined" rounded="lg">
          <v-list class="rounded-lg" bg-color="background">
            <div v-for="(_, group) in auditoriums">
              <div v-if="Object.keys(auditoriums).length > 1">
                <v-list-subheader>
                  <div v-if="group != 'any'">КОРПУС {{ group }}</div>
                  <div v-else>ДРУГОЕ</div>
                </v-list-subheader>
                <v-divider></v-divider>
              </div>
              <div v-for="(room, i) in auditoriums[group]">
                <v-list-item>
                  <v-list-item-title>
                    {{ room.room }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ room.auditorium_type }}
                  </v-list-item-subtitle>

                  <v-divider class="mt-2" v-if="i != auditoriums[group].length - 1"></v-divider>
                </v-list-item>
              </div>
            </div>
          </v-list>
        </v-card>
        <v-empty-state v-else icon="mdi-door-closed-cancel" title="Свободных аудиторий не нашлось"></v-empty-state>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { BuildingGrouped } from '~/types/buildings';
import { useDisplay } from 'vuetify';
import { usePageStore } from '~/store/page';

usePageStore().page_name = 'Свободные аудитории';

const { mdAndUp } = useDisplay();

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

  timeout = setTimeout(async () => {
    loading.value = true;
    await window.ipcBridge.getFreeAuditoriums(selected?.id, dateFrom.value.toISOString(), dateTo.value.toISOString());
  }, 200);
});

watch(auditoriums, async (auditoriums) => {
  loading.value = false;
});

onBeforeMount(async () => {
  buildings.value = await window.ipcBridge.getBuildings();
});
</script>
<style>
.small-centered input {
  text-align: center !important;
}
</style>
