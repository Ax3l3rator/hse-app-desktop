<template>
  <v-container max-width="800">
    <v-card v-if="cafe_info" rounded="lg">
      <v-carousel height="300" show-arrows="hover" cycle :interval="6000">
        <v-carousel-item v-for="photo in cafe_info.photos">
          <v-img cover :src="photo"></v-img>
        </v-carousel-item>
      </v-carousel>
      <v-card-title class="text-h4">{{ cafe_info.cafe_name }}</v-card-title>
      <v-card-subtitle class="text-h6">{{ cafe_info.description }}</v-card-subtitle>

      <v-card-item v-if="cafe_menu">
        <v-alert rounded="lg" v-if="cafe_menu.notify" :text="cafe_menu.notify" type="warning" class="my-4"></v-alert>
        <!-- <v-alert type="warning" class="my-4"> Отображаемое меню не актуально, мы работаем над этим</v-alert> -->
        <v-card-title class="text-h5">Меню</v-card-title>
        <v-list>
          <div v-for="section in cafe_menu.sections">
            <v-list-item>
              <v-list-item-title class="text-h6">{{ section.section_name }}</v-list-item-title>
              <template #append v-if="section.price">{{ section.price }} ₽</template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item v-for="menu_item in section.items">
              <v-list-item-title>
                {{ menu_item.item_name }}
              </v-list-item-title>
              <template #append v-if="menu_item.price"> {{ menu_item.price }} ₽ </template>
            </v-list-item>
          </div>
        </v-list>
      </v-card-item>
      <v-card-item v-else title="Меню не найдено :("> </v-card-item>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { usePageStore } from '~/store/page';
import type { CafeMenu, Cafe } from '~/types/cafes';

const cafe_info = ref<Cafe>();
const cafe_menu = ref<CafeMenu>();

window.ipcBridge.getCafe(useRoute().params.cafe as string).then((res) => {
  cafe_info.value = res;
  if (cafe_info.value) {
    usePageStore().page_name = cafe_info.value.cafe_name;
  }

  if (cafe_info.value?.has_menu) {
    window.ipcBridge.getCafeMenu(useRoute().params.cafe as string).then((menu_res) => {
      cafe_menu.value = menu_res;
    });
  }
  console.log(cafe_info, cafe_menu);
});
</script>
