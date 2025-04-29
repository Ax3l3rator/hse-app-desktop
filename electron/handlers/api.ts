import { ipcMain } from 'electron';
import { HSEAPIService } from '../utils/HSEAPIService';
import type { SearchType } from '~/types/search';

ipcMain.handle('get-search-results', (event, query: string, type: SearchType) =>
  HSEAPIService.requestSearchResults(query, type).then((res) => {
    event.sender.send('search-results-arrived', res);
  }),
);
ipcMain.handle('get-name-by-email', async (_, email) => await HSEAPIService.getNameByEmail(email));
ipcMain.handle('get-full-person-info', async (_, email) => await HSEAPIService.getFullPersonInfo(email));
ipcMain.handle('get-buildings', async () => await HSEAPIService.getBuildings());
ipcMain.handle(
  'get-grades',
  async (_, program_id, academic_year) => await HSEAPIService.getGrades(program_id, academic_year),
);

ipcMain.handle('get-personal-rating', async () => await HSEAPIService.getPersonalRating());
ipcMain.handle('get-rating-list', async () => await HSEAPIService.getRatingList());
ipcMain.handle('get-rating', async (_, target, id) => await HSEAPIService.getRating(target, id));

ipcMain.handle('get-service-list', async (_, category) => await HSEAPIService.getServiceList(category));

ipcMain.handle('get-cafe', async (_, id) => await HSEAPIService.getCafe(id));
ipcMain.handle('get-cafe-menu', async (_, id) => await HSEAPIService.getCafeMenu(id));

ipcMain.handle('get-free-auditoriums', (event, building_id, date_from, date_to) =>
  HSEAPIService.getFreeAuditoriums(building_id, date_from, date_to).then((res) => {
    event.sender.send('free-auditoriums-arrived', res);
  }),
);

ipcMain.handle('get-student-schedule', async (_, email) => await HSEAPIService.getSchedule(email));
