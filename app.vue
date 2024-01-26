<template>
  <v-app>
    <NuxtLayout :name="currentLayout">
      <div class="pr-5 pl-7 pt-3 pb-12">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </v-app>
</template>
<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(var(--v-theme-surface-variant), 0.25);
  border: solid 3.8px transparent;
  background-clip: content-box;
  transition: 0.5s;
}

::-webkit-scrollbar-thumb:hover {
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant));
  border: solid 3px transparent;
  background-clip: content-box;
  transition: 0.5s;
}

::-webkit-scrollbar-button {
  display: none;
}

*::-webkit-scrollbar-track {
  background-color: transparent;
}

*::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
</style>
<script setup lang="ts">
const currentLayout = ref<'authorized' | 'default'>('default');

const auth = await window.electronAPI.checkIfAuthorized();
if (auth) {
  currentLayout.value = 'authorized';
} else {
  currentLayout.value = 'default';
}
currentLayout.value = 'authorized';

window.electronAPI.onAuthorize(() => {
  currentLayout.value = 'authorized';
});

window.electronAPI.onLeave(() => {
  currentLayout.value = 'default';
});
</script>
