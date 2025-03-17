<template>
  <div v-if="schedule && Object.keys(schedule).length != 0">
    <v-list v-for="day in schedule" class="my-4 pa-0 rounded-lg">
      <v-list-item>
        <v-list-item-title class="font-weight-bold no-select pa-0"> {{ day.date }} </v-list-item-title>
      </v-list-item>
      <div v-for="lessons in day.lessons">
        <div v-if="lessons.length !== 0">
          <v-divider></v-divider>
          <v-list-item class="my-1 no-select">
            <v-container fluid class="fill-height">
              <v-row class="flex-nowrap" no-gutters>
                <v-col class="flex-grow-0 flex-shrink-0">
                  <v-card variant="outlined" class="mr-3 pa-2 text-center" width="75" style="height: 100%">
                    <v-container class="pa-0 fill-height">
                      <v-row no-gutters align="center" justify="center">
                        <v-col align-self="center">
                          <v-row no-gutters>
                            <v-col class="text-medium-emphasis text-body-2">
                              {{ pairToTime[lessons[0].pair][0] }}
                            </v-col>
                          </v-row>
                          <v-row no-gutters>
                            <v-col class="text-h6">
                              {{ lessons[0].pair }}
                            </v-col>
                          </v-row>
                          <v-row no-gutters>
                            <v-col class="text-medium-emphasis text-body-2">
                              {{ pairToTime[lessons[0].pair][1] }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card variant="outlined" density="comfortable" class="pa-0">
                    <v-window :show-arrows="lessons.length > 1 ? 'hover' : false">
                      <v-window-item v-for="lesson in lessons">
                        <v-card-item>
                          <v-card-title>
                            <span>
                              {{ lesson.name }}
                            </span>
                          </v-card-title>
                          <template #append>
                            <v-tooltip v-if="lessons.length > 1" text="Несколько пар в это время">
                              <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-alert-circle" color="warning" size="small"> </v-icon>
                              </template>
                            </v-tooltip>
                          </template>
                        </v-card-item>
                        <v-card-text>
                          <div class="text-medium-emphasis">
                            <v-chip v-if="lesson.type" prepend-icon="mdi-school" size="small" class="mt-1">
                              {{ lesson.type }}
                            </v-chip>
                            <v-chip
                              v-if="lesson.place"
                              prepend-icon="mdi-map-marker"
                              size="small"
                              class="mt-1"
                              :class="lesson.type ? 'mx-2' : 'mr-2'"
                            >
                              {{ lesson.place }}
                            </v-chip>
                            <v-chip v-if="lesson.teacher" prepend-icon="mdi-account-school" size="small" class="mt-1">
                              {{ lesson.teacher }}
                            </v-chip>
                          </div>
                        </v-card-text>
                      </v-window-item>
                    </v-window>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item>
        </div>
      </div>
    </v-list>
  </div>
  <div v-else-if="loading">
    <v-container fluid>
      <v-row v-for="_ in [1, 2, 3, 4, 5]">
        <v-col cols="1">
          <v-skeleton-loader width="75" height="100px"> </v-skeleton-loader>
        </v-col>
        <v-col>
          <v-skeleton-loader type="list-item-three-line" height="100px"> </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <nothing-found name="расписании"></nothing-found>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleDay } from '~/types/schedule';

const props = defineProps<{ email: string }>();
// const vuetify = useTheme();
// function docss() {
//   let themeColors = {};
//   const curColors = vuetify.current.value.colors;
//   for (let key in curColors) {
//     themeColors[`--v-theme-${key}`] = curColors[key];
//   }
//   console.log(themeColors);
// }

const pairToTime: { [key: number]: [string, string] } = {
  1: ['9:30', '10:50'],
  2: ['11:10', '12:30'],
  3: ['13:00', '14:20'],
  4: ['14:40', '16:00'],
  5: ['16:20', '17:40'],
  6: ['18:10', '19:30'],
  7: ['19:40', '21:00'],
};

const rawSchedule = ref([]);
const schedule = ref<{ [key: string]: ScheduleDay }>();
const loading = ref(false);

onBeforeMount(() => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  getSchedule();
});

async function getSchedule() {
  rawSchedule.value = await window.electronAPI.getSchedule(props.email);
  schedule.value = UseFormatSchedule(rawSchedule);
}
</script>

<style scoped></style>
