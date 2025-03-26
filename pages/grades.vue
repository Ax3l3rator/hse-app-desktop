<template>
  <div>
    <v-overlay v-if="viewed_grade" v-model="is_viewing_grade" class="d-flex justify-center align-center">
      <v-container class="fill-height">
        <v-row justify="center">
          <v-col cols="12">
            <v-card width="500" rounded="lg">
              <v-card-item>
                <v-card-title class="text-center my-3" style="white-space: normal">{{
                  viewed_grade.discipline
                }}</v-card-title>
                <div v-if="viewed_grade.grade" class="d-flex justify-center align-center">
                  <v-progress-circular
                    class="mx-auto my-2"
                    :color="colorGrade(viewed_grade.grade)"
                    :model-value="10 * (viewed_grade.grade.ten_point_scale ?? (viewed_grade.grade.pass ? 10 : 0))"
                    :size="128"
                    :width="12"
                  >
                    <div class="text-center" v-if="viewed_grade.grade.ten_point_scale">
                      <p class="text-h4">{{ viewed_grade.grade.ten_point_scale }}</p>
                      <p class="text-capitalize">{{ gradeToString(viewed_grade.grade?.five_point_scale) }}</p>
                    </div>
                    <div class="text-center" v-else>
                      <div v-if="viewed_grade.grade.pass">Зачет</div>
                      <div v-else>Незачет</div>
                    </div>
                  </v-progress-circular>
                </div>
                <v-list>
                  <div v-if="viewed_grade.grade?.ten_point_scale">
                    <v-list-item>
                      <v-list-item-title> Оценка (10-бальная) </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">
                          {{ viewed_grade.grade?.ten_point_scale }}
                        </div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.grade?.five_point_scale">
                    <v-list-item>
                      <v-list-item-title> Оценка (5-бальная) </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">
                          {{ gradeToString(viewed_grade.grade?.five_point_scale) }}
                        </div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.lecturer">
                    <v-list-item>
                      <v-list-item-title> Преподаватель </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.lecturer }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.credits">
                    <v-list-item>
                      <v-list-item-title> Кредиты </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.credits }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.aud_hours">
                    <v-list-item>
                      <v-list-item-title> Часы (аудиторные) </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.aud_hours }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.entire_hours">
                    <v-list-item>
                      <v-list-item-title> Часы (общие) </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.entire_hours }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.period_credits">
                    <v-list-item>
                      <v-list-item-title> Кредиты в текущий рейтинг </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.period_credits }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.repass_count">
                    <v-list-item>
                      <v-list-item-title> Пересдачи </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.repass_count }}</div>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <div v-if="viewed_grade.type_raw">
                    <v-list-item>
                      <v-list-item-title> Итоговое испытание </v-list-item-title>
                      <template #append>
                        <div class="text-capitalize text-medium-emphasis">{{ viewed_grade.type_raw }}</div>
                      </template>
                    </v-list-item>
                  </div>
                </v-list>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>
    <v-container max-width="1280" class="pt-4">
      <v-row no-gutters>
        <v-col>
          <v-tabs
            v-if="grades_raw"
            v-model="program"
            align-tabs="center"
            grow
            mandatory
            :disabled="grades_raw.available_programs.length === 1"
            :hide-slider="grades_raw.available_programs.length === 1"
          >
            <v-tab v-for="program in grades_raw.available_programs" :value="program.id" :text="program.name"></v-tab>
          </v-tabs>

          <v-tabs
            v-if="grades_raw && !grades_raw.error"
            v-model="academic_year"
            align-tabs="center"
            density="comfortable"
            grow
            mandatory
            slider-color="primary"
          >
            <v-tab v-for="year in grades_raw.available_academic_years" :value="year" :text="year"></v-tab>
          </v-tabs>
          <v-list density="compact" lines="two" v-if="grades_sorted && !grades_raw.error" class="rounded-b-lg">
            <div v-for="(grades, module) in grades_sorted" :key="module">
              <v-list-subheader class="text-button">{{ module }}</v-list-subheader>
              <div v-if="grades" v-for="(grade, index) in grades" :key="grade.asav_uid">
                <v-list-item @click="openGrade(grade)">
                  <v-list-item-title style="white-space: normal; max-width: 80%">
                    {{ grade.discipline }}
                  </v-list-item-title>
                  <template #append>
                    <div class="text-medium-emphasis opacity-60" v-if="grade.grade">
                      <div v-if="grade.grade.ten_point_scale">{{ grade.grade.ten_point_scale }}</div>
                      <div v-else-if="grade.grade.pass">Зачет</div>
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="index != grades.length - 1"></v-divider>
              </div>
            </div>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { AvailableProgram, Grade, GradeItem } from '~/types/grades';
import { usePageStore } from '~/store/page';

usePageStore().page_name = 'Зачетная книжка';

function gradeToString(grade: number | undefined) {
  if (!grade) return undefined;
  switch (grade) {
    case 5:
      return 'отл.';
    case 4:
      return 'хор.';
    case 3:
      return 'уд.';
    default:
      return 'неуд.';
  }
}

const academic_year = ref('');
const program = ref<AvailableProgram>();
const grades_parsed = ref<GradeItem[]>();
const grades_raw = ref();
const grades_sorted = computed<Record<string, GradeItem[]> | undefined>(() => {
  const grades_obj = grades_parsed.value;

  if (!grades_obj) return undefined;
  const grouped_grades = Object.groupBy(grades_obj, ({ module_name }) => module_name);
  return Object.keys(grouped_grades)
    .sort((a, b) => (a > b ? -1 : 1))
    .reduce((obj: Record<string, GradeItem[]>, key) => {
      obj[key] = grouped_grades[key]!;
      return obj;
    }, {});
});

function colorGrade(grade: Grade) {
  if (grade.ten_point_scale) {
    if (grade.ten_point_scale / 2 >= 4) {
      return 'green';
    } else if (grade.ten_point_scale / 2 >= 3) {
      return 'yellow';
    } else if (grade.ten_point_scale / 2 >= 2) {
      return 'orange';
    } else {
      return 'red';
    }
  } else {
    if (grade.pass) {
      return 'green';
    } else {
      return 'red';
    }
  }
}

const viewed_grade = ref<GradeItem>();
const is_viewing_grade = ref(false);
function openGrade(grade: GradeItem) {
  viewed_grade.value = grade;
  is_viewing_grade.value = !is_viewing_grade.value;
}

const { is_page_loading } = storeToRefs(usePageStore());

window.ipcBridge.getGrades().then((res) => {
  academic_year.value = res.available_academic_years[0];
  program.value = res.available_programs[0];
  grades_raw.value = res;
  grades_parsed.value = res.items;
  is_page_loading.value = false;
});

onMounted(() => {
  watch(program, async (newProgram, oldProgram) => {
    is_page_loading.value = true;
    if (newProgram != oldProgram && program.value) {
      window.ipcBridge.getGrades(program.value.id).then((res) => {
        grades_raw.value = res;
        grades_parsed.value = res.items;
        is_page_loading.value = false;
      });
    }
  });

  watch(academic_year, async (newYear, oldYear) => {
    is_page_loading.value = true;
    if (newYear != oldYear && program.value?.id !== undefined && academic_year.value !== undefined) {
      window.ipcBridge.getGrades(program.value.id, newYear).then((res) => {
        grades_raw.value = res;
        grades_parsed.value = res.items;
        is_page_loading.value = false;
      });
    }
  });
});
</script>

<style></style>
