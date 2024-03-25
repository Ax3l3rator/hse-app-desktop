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
        <v-list-item lines="two" v-else>
          <v-list-item-title>
            {{ `${userData!.names.first_name} ${userData!.names.last_name}` }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-truncate">
            {{ userData?.email }}
          </v-list-item-subtitle>
          <template v-slot:prepend>
            <v-avatar :color="avatarURL ? 'transparent' : 'primary'">
              <v-icon
                v-if="!avatarURL"
                icon="mdi-account"
                class="icon-resize"
                :class="rail ? 'bounce-leave-active' : 'bounce-enter-active'"
              ></v-icon>
              <v-img draggable="false" v-else :src="avatarURL"> </v-img>
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
            <v-skeleton-loader width="167" height="12" elevation="3" class="ml-4 rounded-lg"></v-skeleton-loader>
          </v-list-item>
          <v-list-item
            base-color="red"
            @click="leave"
            :elevation="!rail ? 3 : 0"
            id="leave-button"
            class="text-red rounded-lg"
            v-else
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-close"></v-icon>
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
          class="bg-background rounded-b-lg px-1"
          :class="scrollY > 10 ? 'elevation-6 rounded-b-lg' : 'elevation-0'"
          density="compact"
          flat
          floating
        >
          <div ref="breads">
            <v-breadcrumbs
              :items="breadcrumbsItems"
              density="compact"
              class="d-block text-h6"
              color="primary-lighten-1"
            >
            </v-breadcrumbs>
          </div>

          <v-spacer></v-spacer>

          <!-- <v-btn icon="mdi-close"></v-btn> -->
          <template v-slot:append>
            <v-toolbar-items>
              <v-divider vertical inset class="mr-4"></v-divider>
            </v-toolbar-items>
            <v-btn @click="toggleTheme" density="compact" icon color="surface-variant">
              <v-scale-transition hide-on-leave>
                <v-icon v-if="!theme.global.current.value.dark"> mdi-weather-night</v-icon>
              </v-scale-transition>
              <v-scale-transition hide-on-leave>
                <v-icon v-if="theme.global.current.value.dark">mdi-weather-sunny</v-icon>
              </v-scale-transition>
            </v-btn>
          </template>
        </v-toolbar>
      </div>
      <div class="pr-5 pl-7">
        <slot />
      </div>
    </v-main>
    <v-footer app class="bg-transparent pa-0 d-block" id="footer" ref="footer">
      <v-expand-transition>
        <div id="bottom-pinned" class="pl-5 pr-3 mx-auto d-block" v-if="!hidePagination">
          <v-pagination
            id="pagination-pinned"
            density="compact"
            class="py-1 bg-background"
            :class="elevateFooter ? 'elevation-6 rounded-t-lg' : 'elevation-0'"
          ></v-pagination>
        </div>
      </v-expand-transition>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify/lib/framework.mjs';
import { useUserStore } from '~/store/pinia';

// theme
const theme = useTheme();
const themeName = ref('dark');
const userStore = useUserStore();

watch(themeName, () => {
  theme.global.name.value = themeName.value;
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

const routerNames = ref(
  new Map<string, string>([
    ['', 'Расписание'],
    ['search', 'Поиск'],
    ['students', 'Студенты'],
    ['free', 'Свободные Аудитории'],
    ['teachers', 'Сотрудники'],
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
    icon: 'mdi-door-open',
    title: 'Свободные аудитории',
    value: 'user-settings',
    to: '/free',
  },
]);

const loading = ref(true);
const userData = ref<
  | {
      names: {
        first_name: string;
        last_name: string;
        middle_name: string;
      };
      email: string;
      avatar_url: string;
    }
  | undefined
>();
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
// const breadsHeight = useElementSize(breads).height;
// navigation and nuxt
const route = useRoute();
const hidePagination = computed(() => !route.meta.showPagination);
const avatarURL = ref('');

const breadcrumbsItems = computed(() => {
  return [
    ...route.fullPath
      .split('/')
      .slice(1)
      .map((eve) => {
        if (!routerNames.value.has(eve)) {
          for (const param in useRoute().params) {
            if (param == 'email') {
              return useRoute().params[param] as string;
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
  userData.value = await window.electronAPI.getFullUserInfo();
  avatarURL.value = userData.value!.avatar_url;
  userStore.email = userData.value!.email;
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

#pagination-pinned.elevation-6.rounded-t-lg {
  transition: border-radius 1s;
  transition: box-shadow 1s;
}

#pagination-pinned.elevation-0 {
  transition: border-radius 0.2s;
  transition: box-shadow 0.2s;
}
</style>
