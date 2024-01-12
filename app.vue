<template>
  <NuxtLayout>
    <div class="pr-5 pl-7 py-4">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
<style>
body {
  overflow: overlay;
}

::-webkit-scrollbar {
  width: 8px;
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

::-webkit-scrollbar-button {
  display: none;
}

*::-webkit-scrollbar-track {
  background-color: #00000000;
}

*::-webkit-scrollbar-track-piece {
  background-color: #00000000;
}
</style>
