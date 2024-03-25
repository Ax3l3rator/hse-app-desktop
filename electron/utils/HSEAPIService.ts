import { net } from 'electron';
import { Vault } from './Vault';
import type { SearchType } from '~/types/search';

export class HSEAPIService {
  public static async requestSearchResults(query: string, type: SearchType) {
    return new Promise((resolve, reject) => {
      if (query.length < 3) {
        resolve([]);
      }
      const request = net.request({
        url: `https://dev.hseapp.ru/v3/dump/search?q=${query}${type === 'ALL' ? '' : `&type=${type}`}`,
        method: 'GET',
      });

      const accessToken = Vault.getToken('access');
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.setHeader('Accept-Language', 'ru');
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          resolve(responseData);
        });
        response.on('error', (err: Error) => {
          console.error(err);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });

      request.end();
    });
  }

  public static async getNameByEmail(email: string) {
    return new Promise<any>((resolve, reject) => {
      const request = net.request({
        url: `https://dev.hseapp.ru/v3/dump/email/${encodeURIComponent(email)}`,
        method: 'GET',
      });
      const accessToken = Vault.getToken('access');
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.setHeader('Accept-Language', 'ru');
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          resolve(responseData.email);
        });
        response.on('error', (err: Error) => {
          console.error('An error response:', err);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });

      request.end();
    });
  }

  public static async getFullPersonInfo(email: string) {
    return new Promise<any>((resolve, reject) => {
      const request = net.request({
        url: `https://dev.hseapp.ru/v3/dump/email/${email}`,
        method: 'GET',
      });
      const accessToken = Vault.getToken('access');
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.setHeader('Accept-Language', 'ru');
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          resolve(responseData);
        });
        response.on('error', (err: Error) => {
          console.error('An error response:', err);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });

      request.end();
    });
  }

  public static async getBuildings() {
    return new Promise<any>((resolve, reject) => {
      const request = net.request({
        url: `https://dev.hseapp.ru/v3/dump/buildings/groups`,
        method: 'POST',
      });
      const accessToken = Vault.getToken('access');
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.setHeader('Content-Type', 'application/json');
      request.setHeader('Accept-Language', 'ru');
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          resolve(responseData);
        });
        response.on('error', (err: Error) => {
          console.error('An error response:', err);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });
      request.write(`{"geo":{"type":"Point","coordinates":[0,0]},"is_free":true}`);
      request.end();
    });
  }

  public static async getFreeAuditoriums(building_id: number, date_from: string, date_to: string) {
    return new Promise<any>((resolve, reject) => {
      const request = net.request({
        url: `https://dev.hseapp.ru/rooms/free`,
        method: 'POST',
      });
      const accessToken = Vault.getToken('access');
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.setHeader('Content-Type', 'application/json');
      request.setHeader('Accept-Language', 'ru');
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          resolve(responseData);
        });
        response.on('error', (err: Error) => {
          console.error('An error response:', err);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });
      request.write(`{"building_id":"${building_id}","date_from":"${date_from}","date_to":"${date_to}"}`);
      request.end();
    });
  }
}
