import type { AuditoriumsGrouped, AuditoriumsResult } from '~/types/auditoriums';

export default function () {
  const results = ref<AuditoriumsResult>();

  window.electronAPI.onFreeAuditoriumsResults((auditoriums: AuditoriumsGrouped) => {
    const foundCampuses = [
      ...auditoriums.rooms?.map((auditorium) => {
        if (auditorium.auditorium_building) {
          return [auditorium.auditorium_building, []];
        } else {
          return ['any', []];
        }
      }),
    ];
    const roomsObject = Object.fromEntries(foundCampuses);
    auditoriums.rooms?.forEach((room) => {
      if (room.auditorium_building) {
        roomsObject[room.auditorium_building]?.push(room);
      } else {
        roomsObject['any']?.push(room);
      }
    });
    const sortedKeys = Object.keys(roomsObject).sort();

    results.value = sortedKeys.reduce(function (result, key) {
      // @ts-expect-error
      result[key] = roomsObject[key];
      return result;
    }, {});
  });

  return results;
}
