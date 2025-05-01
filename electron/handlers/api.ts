import { ipcMain } from 'electron';
import { HseAppApi } from '../logic/HseAppApi';
import type { SearchType } from '~/types/search';

ipcMain.handle('get-search-results', (event, query: string, type: SearchType) =>
  HseAppApi.requestSearchResults(query, type).then((res) => {
    event.sender.send('search-results-arrived', res);
  }),
);
ipcMain.handle('get-name-by-email', async (_, email) => await HseAppApi.getNameByEmail(email));
ipcMain.handle('get-full-person-info', async (_, email) => await HseAppApi.getFullPersonInfo(email));
ipcMain.handle('get-buildings', async () => await HseAppApi.getBuildings());
ipcMain.handle(
  'get-grades',
  async (_, program_id, academic_year) => await HseAppApi.getGrades(program_id, academic_year),
);

ipcMain.handle('get-full-user-info', async () => await HseAppApi.getFullUserInfo());
ipcMain.handle('get-personal-rating', async () => await HseAppApi.getPersonalRating());
ipcMain.handle('get-rating-list', async () => await HseAppApi.getRatingList());
ipcMain.handle('get-rating', async (_, target, id) => await HseAppApi.getRating(target, id));

ipcMain.handle('get-service-list', async (_, category) => await HseAppApi.getServiceList(category));

ipcMain.handle('get-cafe', async (_, id) => await HseAppApi.getCafe(id));
ipcMain.handle('get-cafe-menu', async (_, id) => await HseAppApi.getCafeMenu(id));

ipcMain.handle('get-free-auditoriums', (event, building_id, date_from, date_to) =>
  HseAppApi.getFreeAuditoriums(building_id, date_from, date_to).then((res) => {
    event.sender.send('free-auditoriums-arrived', res);
  }),
);

ipcMain.handle('get-student-schedule', async (_, email) => await HseAppApi.getSchedule(email));
