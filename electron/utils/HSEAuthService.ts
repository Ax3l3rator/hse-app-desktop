import { net, shell } from 'electron';
import { isAccessData, isRefreshData } from '../types';
import { CLIENT_ID } from '../config';
import * as jwt from 'jsonwebtoken';
import { Vault } from './Vault';
import type { AccessData, RefreshData } from '../types';
// import { InternalEventEmitter } from './InternalEventEmitter';
import { sendLeaveEvent } from '../mainWindow';

export class HSEAuthService {
  private static getCodeFromUrl(url: string): string {
    const code = new URL(url).searchParams.get('code');
    if (!code) throw new Error('Code Parsing went wrong!');
    return code;
  }

  public static async requestAccessData(
    grant_type: 'authorization_code' | 'refresh_token',
    additional_data: { refresh_token: string } | { code: string },
  ) {
    return new Promise<AccessData | RefreshData>((resolve, reject) => {
      const request = net.request({
        url: 'https://auth.hse.ru/adfs/oauth2/token/',
        method: 'POST',
      });

      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });

        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          if (isAccessData(responseData)) {
            resolve(responseData);
          } else if (isRefreshData(responseData)) {
            resolve(responseData);
          } else {
            reject(new Error('Response data has wrong format'));
          }
        });
        response.on('error', (error: Error) => {
          console.error(error);
          reject(error);
        });
      });

      request.on('error', (error: Error) => {
        console.error(error);
        reject(error);
      });

      request.write(HSEAuthService.getURLEncodedParams(grant_type, additional_data));

      request.end();
    });
  }

  public static async authorizeByRedirectUrl(redirectUrl: string) {
    const code = HSEAuthService.getCodeFromUrl(redirectUrl);
    const accessData = await HSEAuthService.requestAccessData('authorization_code', { code });
    try {
      Vault.saveAccessData(accessData);
    } catch (err) {
      console.error(err);
    }
  }

  public static async refreshAccessData() {
    if (!HSEAuthService.isExpiredToken('refresh')) {
      console.log('Refresh is not expired');
      HSEAuthService.requestAccessData('refresh_token', {
        refresh_token: Vault.getToken('refresh').token,
      })
        .then((accessData) => {
          Vault.saveAccessData(accessData);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      console.log('Refresh is expired');
      throw 'Need to request new refresh token';
    }
  }

  public static isAuthorized() {
    try {
      Vault.getToken('access');
    } catch {
      return false;
    }
    return !HSEAuthService.isExpiredToken('access');
  }

  public static isExpiredToken(tokenType: 'access' | 'refresh'): boolean {
    const token = Vault.getToken(tokenType);
    return token.retrieved_at.getTime() + token.expires_in * 1000 < new Date().getTime();
  }

  private static getURLEncodedParams(
    grant_type: 'access_token' | 'refresh_token' | 'authorization_code',
    additional_data: { refresh_token: string } | { code: string },
  ) {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
      grant_type,
      ...additional_data,
    };

    const urlEncodedParams = new URLSearchParams(params).toString();
    return urlEncodedParams;
  }

  private static getStdAuthURL() {
    return `https://auth.hse.ru/adfs/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback`;
  }

  public static openAuthBrowserExternal() {
    shell.openExternal(HSEAuthService.getStdAuthURL());
  }

  public static authorize() {
    return new Promise<boolean>((resolve, reject) => {
      if (HSEAuthService.isAuthorized()) {
        resolve(true);
      } else {
        HSEAuthService.refreshAccessData()
          .then(() => resolve(true))
          .catch((_) => {
            // console.log(_);
            // InternalEventEmitter.emitAuthEvent();
            reject(false);
          });
      }
    });
  }

  public static getUserInfo() {
    return jwt.decode(Vault.getIDToken(), { complete: true })?.payload;
  }

  public static getFullUserInfo() {
    return new Promise<any>((resolve, reject) => {
      const request = net.request({
        url: 'https://dev.hseapp.ru/v3/dump/me',
        method: 'GET',
      });
      const accessToken = Vault.getToken('access');
      console.log(accessToken);
      request.setHeader('Authorization', `Bearer ${accessToken.token}`);
      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });
        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          console.log(responseData);
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

  public static leave() {
    Vault.resetTokens();
    sendLeaveEvent();
  }
}
