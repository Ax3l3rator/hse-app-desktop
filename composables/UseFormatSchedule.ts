import type { RawScheduleElement, ScheduleDay, ScheduleElement } from '~/types/schedule';

export default function (objectArray: Ref<RawScheduleElement[]>): { [key: string]: ScheduleDay } {
  const lessonsPerDay = new Map<string, Map<number, ScheduleElement[]>>();
  const months = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
  ];
  const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const dateKeys = [
    ...new Set(
      objectArray.value.map(({ date_start }) => {
        const dateObj = new Date(date_start);
        return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
      }),
    ),
  ];

  dateKeys.forEach((key) => {
    const pairMap = new Map<number, ScheduleElement[]>();
    [1, 2, 3, 4, 5, 6, 7].forEach((pair) => {
      pairMap.set(pair, []);
    });
    lessonsPerDay.set(key, pairMap);
  });

  objectArray.value.forEach((lesson) => {
    const dateObj = new Date(lesson.date_start);
    const dateStamp = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
    const addObject: ScheduleElement = {
      name: `${lesson.discipline}`,
      teacher: lesson.lecturer_profiles[0]
        ? `${lesson.lecturer_profiles[0].description} ${lesson.lecturer_profiles[0].full_name}`
        : undefined,
      place: lesson.auditorium
        ? lesson.building
          ? `${lesson.auditorium}, ${lesson.building}`
          : `${lesson.auditorium}`
        : undefined,
      pair: lesson.lesson_number_start,
      type: lesson.kindOfWork ? `${lesson.kindOfWork}` : undefined,
    };

    if (lessonsPerDay.has(dateStamp)) {
      const datemap = lessonsPerDay.get(dateStamp);
      if (datemap!.has(addObject.pair)) {
        const pairArr = datemap!.get(addObject.pair);
        pairArr!.push(addObject);
      }
    }
  });

  const finalObj: { [key: string]: ScheduleDay } = {};
  Array.from(lessonsPerDay.keys()).forEach((key) => {
    finalObj[key] = {
      date: `${new Date(key).getDate()} ${months[new Date(key).getMonth()]}, ${
        daysOfWeek[new Date(key).getDay() - 1]
      }.`,
      lessons: Object.fromEntries(lessonsPerDay.get(key)!),
    };
  });
  return finalObj;
}
