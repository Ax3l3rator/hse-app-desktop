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

const service_list = ref<ServiceList>();

window.ipcBridge.getServiceList().then((res) => {
  service_list.value = res;
});

async function openService(service?: ServiceListItem) {
  if (service?.category) {
    await navigateTo({ path: '/services', query: { category: service.category } });
    // console.log(service.category);
    // window.ipcBridge.getServiceList(service.category).then((res) => {
    //   console.log(res);
    //   service_list.value = res;
    // });
  } else if (service?.url) {
    window.ipcBridge.openInBrowser(service.url);
  }
}
</script>
<style></style>
