<template>
  <div>
    <v-navigation-drawer
      permanent
      :rail="(!loading && rail) || !railEnabled"
      :expand-on-hover="!railEnabled"
      @mouseover="rail = false"
      @mouseleave="rail = true"
    >
      <template v-slot:prepend>
        <v-list-item v-if="loading">
          <v-skeleton-loader type="list-item-avatar-two-line"></v-skeleton-loader>
        </v-list-item>
        <v-list-item
          lines="two"
          v-else
          :title="`${userData!.given_name} ${userData!.family_name}`"
          :subtitle="userData!.email"
        >
          <template v-slot:prepend>
            <v-avatar color="primary">
              <v-icon
                icon="mdi-account"
                class="icon-resize"
                :class="rail ? 'bounce-leave-active' : 'bounce-enter-active'"
              ></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-if="loading" v-for="element of menuElements" :key="element.to">
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </v-list-item>
        <v-list-item
          v-for="element of menuElements"
          v-else
          :key="element.value"
          :to="element.to"
          :value="element.value"
          :prepend-icon="element.icon"
          :title="element.title"
        >
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list density="compact" nav>
          <v-skeleton-loader v-if="loading" type="list-item" elevation="3"></v-skeleton-loader>
          <v-list-item
            id="leave-button"
            v-else
            @click="leave"
            prepend-icon="mdi-close"
            class="text-red"
            :elevation="!rail ? 3 : 0"
          >
            <div class="ml-7 unselectable">ВЫЙТИ</div>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <div id="pinned" class="pl-5 pr-3">
        <div>
          <v-breadcrumbs
            id="breads-pinned"
            :items="breadcrumbsItems"
            density="compact"
            :class="elevate ? 'elevated rounded-b-lg' : 'unelevated'"
            class="py-4 text-h6 text-capitalize"
            color="primary"
          >
          </v-breadcrumbs>
        </div>
      </div>
      <slot />
    </v-main>
  </div>
</template>

<script setup lang="ts">
console.log(useRouter().getRoutes());
const route = useRoute().params;

const breadcrumbsItems = computed(() => {
  return [
    ...useRoute()
      .fullPath.split('/')
      .slice(1)
      .map((eve) => {
        if (!routerNames.value.has(eve)) {
          for (const param in useRoute().params) {
            if (param == 'id') {
              return `id-${useRoute().params[param]}`;
            }
          }
        }
        return routerNames.value.get(eve) as string;
      }),
    '',
  ];
});

const routerNames = ref(
  new Map<string, string>([
    ['', 'расписание'],
    ['search', 'поиск'],
    ['students', 'студенты'],
    ['auditoriums', 'аудитории'],
    ['teachers', 'сотрудники'],
  ]),
);
const menuElements = ref([
  {
    icon: 'mdi-timetable',
    title: 'Расписание',
    value: 'timetable',
    to: '/',
  },
  {
    icon: 'mdi-magnify',
    title: 'Поиск',
    value: 'search',
    to: '/search',
  },
  {
    icon: 'mdi-account-cog',
    title: 'Настройки профиля',
    value: 'user-settings',
    to: '/students/3',
  },
]);
const rail = ref(true);
function leave() {
  window.electronAPI.leave();
}
const loading = ref(true);
const userData = ref<{ given_name: string; family_name: string; email: string } | undefined>();
loading.value = true;
userData.value = await window.electronAPI.getUserInfo();
setTimeout(() => {
  loading.value = false;
  console.log(loading.value);
}, 1000);

const elevate = computed<boolean>(() => useWindowScroll().y.value > 10);

const railEnabled = computed(() => useWindowSize().width.value > 750);
</script>

<style scoped>
#pinned {
  /* background-color: rgba(var(--v-theme-surface-variant)); */
  /* position: -webkit-sticky; */
  position: sticky;
  top: 0;
  z-index: 1;
}

#breads-pinned {
  background: rgba(var(--v-theme-background));
}
:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none;
}
*.unselectable {
  user-select: none;
  -webkit-user-select: none;
}
.bounce-enter-active {
  transform: scale(1.666666667);
  transition: transform 0.2s;
}
.bounce-leave-active {
  transform: scale(1);
  transition: transform 0.2s;
}
.icon-resize {
  font-size: 16px;
}

#leave-button.elevation-0 {
  transition: all 0.2s;
}
#leave-button.elevation-3 {
  transition: all 1s;
}

.elevated {
  /* transition: all 0.2s; */
  box-shadow: 0px 2px 8px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 4px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 20px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12)) !important;
}

.elevated.rounded-b-xl {
  transition: all 0.2s;
}
.unelevated {
  transition: all 0.2s;
}
</style>
