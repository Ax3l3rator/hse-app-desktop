<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
<style>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(var(--v-theme-surface-variant), 0.25);
  border: solid 3.8px transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant));
  border: solid 3px transparent;
  background-clip: content-box;
}
</style>
