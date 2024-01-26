<template>
  <div class="my-auto mx-auto pr-5 pl-7 py-4">
    <v-sheet class="rounded-lg pa-4" width="400" height="200">
      <v-container>
        <v-row no-gutters justify="center" align="center" align-content="center">
          <v-col cols="10" class="text-center text-medium-emphasis">
            Вы не вошли в учетную запись, если окно авторизации не открылось в браузере - нажмите на кнопку ниже
          </v-col>
        </v-row>
        <v-row no-gutters justify="center" align="center" class="mt-6">
          <v-col cols="8" class="d-flex justify-content-center">
            <v-btn variant="tonal" color="blue-darken-1 mx-auto" block @click="authorize()"> Войти </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>
<script setup lang="ts">
const authorize = () => {
  window.electronAPI.authorizeViaBrowser();
};
</script>
