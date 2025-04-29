<template>
  <v-card v-if="info && cardAvailable" variant="outlined" class="rounded-lg">
    <v-container fluid class="fill-height">
      <v-row no-gutters>
        <v-avatar class="ma-3" rounded="0" size="125">
          <v-icon v-if="!info.avatar_url" icon="mdi-account"></v-icon>
          <v-img draggable="false" v-else :src="info.avatar_url"> </v-img>
        </v-avatar>
        <v-col>
          <v-card-title>
            <v-row no-gutters>
              <div class="mr-2">
                {{ info.full_name }}
              </div>
              <v-snackbar rounded="lg" :timeout="1000" color="primary">
                Скопировано!
                <template v-slot:activator="{ props }">
                  <v-chip color="primary" prepend-icon="mdi-at" @click="copyToClipBoard(info.email)" v-bind="props">
                    {{ info.email }}
                  </v-chip>
                </template>
              </v-snackbar>
            </v-row>
          </v-card-title>
          <v-card-subtitle v-if="info">
            {{ info.description }}
            <v-chip v-if="info.birth_date" density="comfortable" prepend-icon="mdi-cake-variant">
              {{ new Date(info.birth_date).getDate() }}
              {{ months[new Date(info.birth_date).getMonth()] }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text>
            <div v-if="info.staff_address" v-for="el in info.staff_address">
              <v-divider></v-divider>
              <v-list-item prepend-icon="mdi-domain">
                <v-list-item-title>
                  <p class="text-medium-emphasis">Адрес</p>
                </v-list-item-title>
                {{ el.label }}
              </v-list-item>
              <v-list-item prepend-icon="mdi-clock" v-if="el.presence_time">
                <v-list-item-title v-if="el.presence_type">
                  <p class="text-medium-emphasis">{{ el.presence_type }}</p>
                </v-list-item-title>
                {{ el.presence_time }}
              </v-list-item>
              <v-list-item prepend-icon="mdi-phone" v-if="el.phone_work">
                <v-list-item-title>
                  <p class="text-medium-emphasis">Телефон</p>
                </v-list-item-title>
                {{ el.phone_work }}<a v-if="el.phone_internal_ext">, {{ el.phone_internal_ext }} </a>
              </v-list-item>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <div v-else-if="cardAvailable">
    <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
  </div>
  <div v-else>
    <v-empty-state icon="mdi-card-account-details-outline" title="Информации о сотруднике не нашлось"></v-empty-state>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ email: string }>();
const info = ref();
const cardAvailable = ref(true);
const months = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
];

onBeforeMount(async () => {
  info.value = await window.ipcBridge.getFullPersonInfo(props.email);
  if ('error' in info.value || !info.value) {
    cardAvailable.value = false;
  }
});

function copyToClipBoard(query: string) {
  navigator.clipboard.writeText(query);
}
</script>
