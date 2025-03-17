<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-select
          variant="outlined"
          :items="buildings"
          hide-details="auto"
          density="comfortable"
          item-title="name"
          item-value="id"
          v-model="selected_building"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list v-if="cafes">
          <div v-for="(cafe, i) in cafes[selected_building][0].cafes">
            <v-list-item @click="goToCafePage(cafe)" class="py-3">
              <v-list-item-title>{{ cafe.cafe_name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="isCafeOpenNow(cafe.opening_hours).is_open">
                  <span class="text-green">Открыто</span> | Закроется в
                  {{ isCafeOpenNow(cafe.opening_hours).next_time }}
                </span>
                <span v-else>
                  <span class="text-red">Закрыто</span> | Откроется в {{ isCafeOpenNow(cafe.opening_hours).next_time }}
                </span>
              </v-list-item-subtitle>
              <template #prepend>
                <v-avatar rounded="lg" size="60" :color="cafe.photo ? '' : 'surface-variant'" border="md">
                  <v-img v-if="cafe.photo" :src="cafe.photo"></v-img>
                  <v-icon size="40" v-else> mdi-silverware</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
            <v-divider v-if="i !== cafes[selected_building][0].cafes.length - 1"></v-divider>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { BuildingCafe, Cafe, OpeningHour } from '~/types/cafes';

definePageMeta({
  title: 'Кафе и рестораны',
});

const cafes = ref<Record<string, BuildingCafe[]>>();
const buildings = ref<{ id: string; name: string }[]>();
const selected_building = ref<string>('2311');

window.electronAPI.getCafe().then((res) => {
  buildings.value = res.map(({ campus_id, campus_name }) => {
    return { id: campus_id, name: campus_name };
  });
  cafes.value = Object.groupBy(res, ({ campus_id }) => campus_id) as Record<string, BuildingCafe[]>;
});

async function goToCafePage(cafe: Cafe) {
  await navigateTo({ name: 'cafes-cafe', params: { cafe: `${cafe.cafe_id}` } });
}

function isCafeOpenNow(schedule: OpeningHour[]): { is_open: boolean; next_time: string | undefined } {
  const days_of_week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  const next_day = today === 6 ? 0 : today + 1;
  const today_schedule = schedule.find((day) => day.day_of_week === days_of_week[today]);
  const next_day_schedule = schedule.find((day) => day.day_of_week === days_of_week[next_day]);

  if (!today_schedule || !today_schedule.is_open || !today_schedule.start_time || !today_schedule.end_time) {
    return { is_open: false, next_time: next_day_schedule?.start_time };
  }

  const current_time = new Date().toTimeString().slice(0, 5);
  const is_in_time = current_time >= today_schedule.start_time && current_time <= today_schedule.end_time;

  if (!is_in_time) {
    return { is_open: false, next_time: next_day_schedule?.start_time };
  } else {
    return { is_open: true, next_time: next_day_schedule?.end_time };
  }
}
</script>
