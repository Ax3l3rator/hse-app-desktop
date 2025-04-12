<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
/* .page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--v-theme-background-color);
}

div.content-holder {
  cursor: default;
}

main {
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 8px;
  cursor: pointer !important;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(var(--v-theme-surface-variant), 0.25);
  border: solid 3.8px transparent;
  background-clip: content-box;
  transition: 0.5s;
  cursor: pointer !important;
}

::-webkit-scrollbar-thumb:hover {
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant));
  border: solid 3px transparent;
  background-clip: content-box;
  transition: 0.5s;
  cursor: pointer !important;
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
