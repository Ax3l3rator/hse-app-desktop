<template>
  <v-app id="hse">
    <v-navigation-drawer permanent class="d-block py-1" rail expand-on-hover>
      <v-list>
        <v-list-item title="John Leider" subtitle="john@google.com">
          <template v-slot:append>
            <v-btn size="small" variant="plain" icon="mdi-cog"></v-btn>
          </template>
          <template v-slot:prepend>
            <v-avatar color="primary">
              <v-icon icon="mdi-account"></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="element of menuElements"
          :key="element.value"
          :to="element.to"
          :value="element.value"
          :prepend-icon="element.icon"
          :title="element.title"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const menuElements = ref([
  {
    icon: 'mdi-home',
    title: 'Future navigation',
    value: 'home',
    to: '/',
  },
  {
    icon: 'mdi-magnify',
    title: 'Future navigation',
    value: 'search',
    to: '/auth',
  },
]);
</script>

<style scoped>
:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none;
}
</style>
