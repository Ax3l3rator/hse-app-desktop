<template>
  <v-container max-width="1280">
    <v-row justify="space-between" self-align="space-between">
      <v-col v-for="service in service_list" :key="service.id">
        <v-card variant="outlined" rounded="lg" class="py-3" min-width="420">
          <v-card-item>
            <template #prepend>
              <v-avatar tile size="100">
                <v-img :src="service.icon"></v-img>
              </v-avatar>
            </template>

            <v-card-title> {{ service.name }} </v-card-title>
            <v-card-subtitle v-if="service.description" class="text-medium-emphasis">
              {{ service.description }}
            </v-card-subtitle>
            <div class="pt-2">
              <v-btn rounded="lg" @click="openService(service)" variant="flat" color="primary" block>ПЕРЕЙТИ</v-btn>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { ServiceList, ServiceListItem } from '~/types/services';
import { usePageStore } from '~/store/page';

const { params, query } = useRoute();

if (!params.category.length) {
  usePageStore().page_name = 'Сервисы';
} else {
  usePageStore().page_name = query.name as string;
}

const service_list = ref<ServiceList>();

window.ipcBridge.getServiceList(params.category.length ? (params.category as string) : undefined).then((res) => {
  service_list.value = res;
});

async function openService(service?: ServiceListItem) {
  if (service?.category) {
    await navigateTo({ params: { category: service.category }, query: { name: service.name } });
  } else if (service?.url) {
    window.ipcBridge.openInBrowser(service.url);
  }
}
</script>
<style></style>
