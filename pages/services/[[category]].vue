<template>
  <v-container>
    <v-row>
      <v-col cols="6" v-for="service in service_list" :key="service.id">
        <v-card variant="outlined">
          <v-card-item>
            <template #prepend>
              <v-avatar class="ma-3" tile size="120">
                <v-img :src="service.icon"></v-img>
              </v-avatar>
            </template>

            <v-card-title> {{ service.name }} </v-card-title>
            <v-card-subtitle v-if="service.description" class="text-medium-emphasis">
              {{ service.description }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn @click="openService(service)" variant="flat" color="primary" block>ПЕРЕЙТИ</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { ServiceList, ServiceListItem } from '~/types/services';

definePageMeta({
  title: 'Сервисы',
});

const service_list = ref<ServiceList>();

const { params } = useRoute();

window.electronAPI.getServiceList(params.category.length ? (params.category as string) : undefined).then((res) => {
  // console.log(res);
  service_list.value = res;
});

async function openService(service?: ServiceListItem) {
  if (service?.category) {
    await navigateTo({ params: { category: service.category } });
  } else if (service?.url) {
    window.electronAPI.openInBrowser(service.url);
  }
}
</script>
<style></style>
