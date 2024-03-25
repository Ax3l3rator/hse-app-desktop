<template>
  <v-card v-if="info" variant="outlined" class="rounded-lg">
    <v-container fluid class="fill-height">
      <v-row no-gutters>
        <v-avatar class="ma-3" rounded="0" size="125" :color="!info.avatar_url ? 'primary' : ''">
          <v-icon v-if="!info.avatar_url" icon="mdi-account" size="100"></v-icon>
          <v-img draggable="false" v-else :src="info.avatar_url"> </v-img>
        </v-avatar>
        <v-col>
          <v-card-title>
            <v-row no-gutters>
              <div class="mr-2">
                {{ info.full_name }}
              </div>
              <v-snackbar :timeout="1000" color="primary">
                Скопировано!
                <template v-slot:activator="{ props }">
                  <v-chip color="primary" prepend-icon="mdi-at" @click="copyToClipBoard(info.email)" v-bind="props">
                    {{ info.email }}
                  </v-chip>
                </template>
              </v-snackbar>
            </v-row>
          </v-card-title>
          <v-card-subtitle>{{ info.description }}</v-card-subtitle>
          <v-card-text>
            <v-chip prepend-icon="mdi-domain" class="mt-2 mr-2">{{ info.education[0].faculty_title }}</v-chip>
            <v-chip prepend-icon="mdi-school" class="mt-2 mr-2">{{ info.education[0].program_title }}</v-chip>
            <v-chip prepend-icon="mdi-account-multiple" class="mt-2 mr-2">{{ info.education[0].degree }}</v-chip>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <div v-else-if="loading">
    <v-skeleton-loader type="card-avatar"></v-skeleton-loader>
  </div>
  <div v-else>
    <nothing-found name="студенте"></nothing-found>
  </div>
</template>
<script setup lang="ts">
const loading = ref(false);

const props = defineProps<{ email: string }>();
const info = ref();
onBeforeMount(async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 20000);
  info.value = await window.electronAPI.getFullPersonInfo(props.email);
});

function copyToClipBoard(query: string) {
  navigator.clipboard.writeText(query);
}
</script>
