<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
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
<script setup lang="ts"></script>
