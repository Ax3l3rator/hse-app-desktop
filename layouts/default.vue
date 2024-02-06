<template>
  <v-app>
    <v-navigation-drawer
      permanent
      :expand-on-hover="!railEnabled"
      :rail="(!loading && rail) || !railEnabled"
      @mouseover="rail = false"
      @mouseleave="rail = true"
      :elevation="!rail && !railEnabled ? '6' : '0'"
    >
      <template v-slot:prepend>
        <v-list-item v-if="loading">
          <template v-slot:prepend>
            <v-avatar>
              <v-skeleton-loader class="ma-0 pa-0" type="avatar"></v-skeleton-loader>
            </v-avatar>
          </template>
          <v-skeleton-loader width="135" height="12" class="ma-4 rounded-xl"></v-skeleton-loader>
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
          <template v-slot:prepend>
            <v-skeleton-loader width="24" height="24"></v-skeleton-loader>
          </template>
          <v-skeleton-loader width="167" height="12" class="ma-4 rounded-xl"></v-skeleton-loader>
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
          <v-list-item v-if="loading">
            <template v-slot:prepend>
              <v-skeleton-loader width="24" height="24"></v-skeleton-loader>
            </template>
            <v-skeleton-loader width="167" height="12" elevation="3" class="ml-4 rounded-xl"></v-skeleton-loader>
          </v-list-item>
          <v-list-item
            @click="leave"
            :elevation="!rail ? 3 : 0"
            id="leave-button"
            prepend-icon="mdi-close"
            class="text-red"
            v-else
          >
            <template v-slot:append>
              <v-icon></v-icon>
            </template>
            <!-- <template v-slot:title> <div class="d-block">ВЫЙТИ</div> </template> -->
            <!-- <template v-slot:default>
              <v-btn block class="text-red" variant="text" density="compact">ВЫЙТИ</v-btn>
            </template> -->
            <div class="ml-7 unselectable">ВЫЙТИ</div>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main ref="pageElement">
      <div class="pl-5 pr-3" id="pinned">
        <v-toolbar
          class="mx-auto bg-background"
          :class="scrollY > 10 ? 'elevation-6 rounded-b-lg' : 'elevation-0'"
          :height="breadsHeight"
          flat
        >
          <div ref="breads">
            <v-breadcrumbs
              id="breads-pinned"
              :items="breadcrumbsItems"
              density="compact"
              class="py-4 text-h6 text-capitalize"
              color="primary"
            >
            </v-breadcrumbs>
          </div>
        </v-toolbar>
      </div>
      <div class="pr-5 pl-7 py-4">
        <slot />
      </div>
    </v-main>
    <v-footer app class="bg-transparent pa-0 d-block" id="footer" ref="footer">
      <v-expand-transition>
        <div id="bottom-pinned" class="pl-5 pr-3 mx-auto d-block" v-if="!hidePagination">
          <v-pagination
            id="pagination-pinned"
            density="comfortable"
            class="py-1"
            :class="elevateFooter ? 'elevation-6 rounded-t-lg' : 'elevation-0'"
          ></v-pagination>
        </div>
      </v-expand-transition>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
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

const loading = ref(true);
const userData = ref<{ given_name: string; family_name: string; email: string } | undefined>();
// rail related
const windowWidth = useWindowSize().width;
const rail = ref(true);
const railEnabled = computed(() => windowWidth.value > 1000);
// scroll related
const scrollY = useWindowScroll().y;
const windowHeight = useWindowSize().height;
// footer related
const footer = ref(null);
const footerHeight = useElementSize(footer).height;
const pageElement = ref(null);
const elementSize = useElementSize(pageElement).height;
const documentHeight = computed(() => Number(elementSize.value.toFixed()) + Number(footerHeight.value.toFixed()));
const elevateFooter = computed(() => documentHeight.value - windowHeight.value - scrollY.value > 10);
// breads related
const breads = ref(null);
const breadsHeight = useElementSize(breads).height;
// navigation and nuxt
const route = useRoute();
const hidePagination = computed(() => !route.meta.showPagination);
const breadcrumbsItems = computed(() => {
  return [
    ...route.fullPath
      .split('/')
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

function leave() {
  window.electronAPI.leave();
  setPageLayout('unauthorized');
  navigateTo('unauthorized');
}

setTimeout(async () => {
  userData.value = await window.electronAPI.getUserInfo();
  loading.value = false;
}, 1500);

window.electronAPI.onLeave(() => {
  setPageLayout('default');
  navigateTo('unauthorized');
});
</script>

<style scoped>
#breads-pinned.elevation-6.rounded-b-lg {
  transition: all 0.5s;
}

#breads-pinned.elevation-0 {
  transition: all 0.2s;
}

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

#bottom-pinned {
  /* background-color: rgba(var(--v-theme-surface-variant)); */
  /* position: -webkit-sticky; */
  position: sticky;
  bottom: 0;
  /* top: 100%; */
  z-index: 1;
}

#pagination-pinned {
  background: rgba(var(--v-theme-background));
}

#pagination-pinned.elevation-6.rounded-t-lg {
  transition: all 0.5s;
}

#pagination-pinned.elevation-0 {
  transition: all 0.2s;
}
</style>
