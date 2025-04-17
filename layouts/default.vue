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
        <v-list-item density="compact" lines="two" v-else>
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
        <div v-else v-for="element of menuElements">
          <v-list-item
            rounded="lg"
            v-if="element.type === 'any' || element.type === userData?.type"
            :key="element.value"
            :to="element.to"
            :prepend-icon="element.icon"
            :title="element.title"
          >
          </v-list-item>
        </div>
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
            <div class="ml-7 unselectable">ВЫЙТИ</div>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar density="comfortable">
      <template #prepend>
        <v-btn class="mx-1" density="comfortable" @click="router.back()" icon="mdi-arrow-left-circle"></v-btn>
        <v-divider class="ml-1" vertical inset></v-divider>
      </template>

      <v-app-bar-title> {{ page_name }} </v-app-bar-title>
      <v-progress-linear absolute location="bottom" :active="is_page_loading" indeterminate color="primary">
      </v-progress-linear>
      <v-spacer></v-spacer>
      <template #append>
        <v-toolbar-items>
          <v-divider vertical inset class="mr-2"></v-divider>
        </v-toolbar-items>
        <v-fab class="mr-2" @click="toggleTheme" density="compact" icon color="surface-variant">
          <v-scale-transition hide-on-leave>
            <v-icon v-if="!theme.global.current.value.dark"> mdi-weather-night</v-icon>
          </v-scale-transition>
          <v-scale-transition hide-on-leave>
            <v-icon v-if="theme.global.current.value.dark">mdi-weather-sunny</v-icon>
          </v-scale-transition>
        </v-fab>
      </template>
    </v-app-bar>
    <v-main>
      <div class="pr-5 pl-7" style="height: 100%; overflow-y: auto">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useUserStore } from '~/store/user';
import { usePageStore } from '~/store/page';

const theme = useTheme();
const themeName = ref('dark');
const userStore = useUserStore();
const router = useRouter();

const { page_name, is_page_loading } = storeToRefs(usePageStore());

watch(themeName, () => {
  theme.global.name.value = themeName.value;
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

const menuElements = ref([
  {
    icon: 'mdi-timetable',
    title: 'Расписание',
    value: 'timetable',
    to: '/',
    type: 'any',
  },
  {
    icon: 'mdi-magnify',
    title: 'Поиск',
    value: 'search',
    to: '/search',
    type: 'any',
  },
  {
    icon: 'mdi-door-open',
    title: 'Свободные аудитории',
    value: 'user-settings',
    to: '/free',
    type: 'any',
  },
  {
    icon: 'mdi-book-open-variant-outline',
    title: 'Зачетная книжка',
    value: 'grade-book',
    to: '/grades',
    type: 'STUDENT',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Рейтинг',
    value: 'rating',
    to: '/rating',
    type: 'STUDENT',
  },
  {
    icon: 'mdi-compass-outline',
    title: 'Сервисы',
    value: 'services',
    to: '/services',
    type: 'any',
  },
  {
    icon: 'mdi-silverware-variant',
    title: 'Кафе и столовые',
    value: 'cafes',
    to: '/cafes',
    type: 'any',
  },
]);

onMounted(() => {
  if (import.meta.dev) {
    // menuElements.value.push({
    //   icon: 'mdi-test-tube',
    //   title: 'Тестовая страница',
    //   value: 'testing-page',
    //   to: '/testing',
    //   type: 'any',
    // });
  }
});

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
      type: string;
    }
  | undefined
>();

const windowWidth = useWindowSize().width;
const rail = ref(true);
const railEnabled = computed(() => windowWidth.value > 1000);
const avatarURL = ref('');

function leave() {
  window.ipcBridge.leave();
  navigateTo('unauthorized');
}

setTimeout(async () => {
  userData.value = await window.ipcBridge.getFullUserInfo();
  avatarURL.value = userData.value!.avatar_url;
  userStore.email = userData.value!.email;
  userStore.full_name = `${userData.value?.names.last_name} ${userData.value?.names.first_name} ${userData.value?.names.middle_name}`;
  userStore.avatar_url = userData.value!.avatar_url;
  loading.value = false;
}, 200);

window.ipcBridge.onLeave(() => {
  navigateTo('unauthorized');
});
</script>

<style scoped>
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
</style>
