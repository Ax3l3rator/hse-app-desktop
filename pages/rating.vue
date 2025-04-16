<template>
  <v-container max-width="1280">
    <v-row>
      <v-col cols="3" class="pr-4">
        <v-select
          hide-details="auto"
          density="comfortable"
          variant="outlined"
          :items="rating_target_items"
          item-title="title"
          item-value="id"
          v-model="selected_rating_target"
          rounded="lg"
        ></v-select>
      </v-col>
      <v-col cols="9">
        <v-select
          hide-details="auto"
          density="comfortable"
          variant="outlined"
          :items="ratings_list"
          item-title="title"
          item-value="id"
          v-model="selected_rating_id"
          rounded="lg"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card variant="outlined" rounded="lg">
          <v-card-item>
            <v-card-title>
              {{ user.full_name }}
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col class="text-medium-emphasis">Место в рейтинге</v-col>
                <v-col class="text-medium-emphasis">Перцентиль</v-col>
                <v-col class="text-medium-emphasis">GPA</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="text-primary">{{ user_position }}</v-col>
                <v-col class="text-primary">{{ user_percentile }}%</v-col>
                <v-col class="text-primary">{{ user_gpa }}</v-col>
              </v-row>
            </v-card-text>
            <template #prepend>
              <v-avatar :color="!user.avatar_url ? 'primary' : ''" size="80">
                <v-icon v-if="!user.avatar_url" color="white">mdi-account</v-icon>
                <v-img v-else :src="user.avatar_url"></v-img>
              </v-avatar>
            </template>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list v-if="ratings_grouped" class="rounded-lg">
          <div v-for="(rating_item, index, j) in ratings_grouped">
            <v-list-item class="pa-0">
              <template #prepend> </template>
              <v-list-item
                :to="`/students/${rating.profile.email}`"
                v-for="(rating, i) in rating_item"
                rounded="lg"
                class="mx-2"
              >
                <v-list-item-title> {{ rating.profile.full_name }} </v-list-item-title>
                <template #prepend>
                  <div
                    class="mr-4 text-primary"
                    :style="{
                      width: '3ch',
                      visibility: i === 0 ? 'visible' : 'hidden',
                    }"
                  >
                    {{ index }}
                  </div>
                  <v-avatar :color="!rating.profile.avatar_url ? 'primary' : ''">
                    <v-icon v-if="!rating.profile.avatar_url">mdi-account</v-icon>
                    <v-img v-else :src="rating.profile.avatar_url"></v-img>
                  </v-avatar>
                </template>
                <template #append>
                  <div class="text-primary">{{ rating.percentile }}%</div>
                </template>
              </v-list-item>
              <v-divider class="my-2" v-if="j !== Object.values(ratings_grouped).length - 1"></v-divider>
            </v-list-item>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { usePageStore } from '~/store/page';
import { useUserStore } from '~/store/user';
import type { RatingItem } from '~/types/rating';

usePageStore().page_name = 'Рейтинг';

const user = useUserStore();

const user_gpa = ref('');
const user_position = ref(0);
const user_percentile = ref('');

const ratings_list = ref<{ id: string; title: string }[]>();
const selected_rating_id = ref('');
const selected_rating_target = ref<'RATING_TARGET_PROGRAM' | 'RATING_TARGET_GROUP'>('RATING_TARGET_PROGRAM');
const rating_target_items = [
  {
    id: 'RATING_TARGET_PROGRAM',
    title: 'Программа',
  },
  {
    id: 'RATING_TARGET_GROUP',
    title: 'Группа',
  },
];

const ratings = ref<RatingItem[]>([]);
const ratings_grouped = ref<Record<number, RatingItem[]>>();

const { is_page_loading } = storeToRefs(usePageStore());

is_page_loading.value = true;

watch(selected_rating_target, (old_r, new_r) => {
  if (old_r === new_r) return;
  is_page_loading.value = true;
  window.ipcBridge.getRating(selected_rating_target.value, selected_rating_id.value).then((res) => {
    ratings.value = res.items;
    ratings_grouped.value = Object.groupBy(res.items, ({ index }) => index) as Record<number, RatingItem[]>;
    is_page_loading.value = false;
  });
});

watch(selected_rating_id, (old_r, new_r) => {
  if (old_r === new_r) return;
  is_page_loading.value = true;
  window.ipcBridge.getRating(selected_rating_target.value, selected_rating_id.value).then((res) => {
    ratings.value = res.items;
    ratings_grouped.value = Object.groupBy(res.items, ({ index }) => index) as Record<number, RatingItem[]>;
    is_page_loading.value = false;
  });
});

window.ipcBridge.getPersonalRating().then((res) => {
  user_gpa.value = res.gpa;
  user_position.value = res.index;
  user_percentile.value = res.percentile;
});

window.ipcBridge.getRatingList().then((res) => {
  selected_rating_id.value = res[0].id;
  ratings_list.value = res.map(({ id, title }) => {
    return { id, title };
  });
  // window.ipcBridge.getRating(selected_rating_target.value, selected_rating_id.value).then((res) => {
  //   ratings.value = res.items;
  //   ratings_grouped.value = Object.groupBy(res.items, ({ index }) => index) as Record<number, RatingItem[]>;
  // });
});
</script>
<style></style>
