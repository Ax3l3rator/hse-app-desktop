import { net, shell } from 'electron';
import { isAccessData } from '../types';
import { CLIENT_ID } from '../config';
import { Vault } from './Vault';
import type { AccessData } from '../types';
import { sendLeaveEvent } from '../mainWindow';

export class HseAuth {
  private static getCodeFromUrl(url: string): string {
    const code = new URL(url).searchParams.get('code');
    if (!code) throw new Error('Code Parsing went wrong!');
    return code;
  }

  public static async requestAccessData(
    grant_type: 'authorization_code' | 'refresh_token',
    additional_data: { refresh_token: string } | { code: string },
  ) {
    return new Promise<AccessData>((resolve, reject) => {
      const request = net.request({
        url: 'https://saml.hse.ru/realms/hse/protocol/openid-connect/token/',
        method: 'POST',
      });

      request.setHeader('Content-Type', 'application/x-www-form-urlencoded');

      request.on('response', (response) => {
        const data: Buffer[] = [];
        response.on('data', (chunk) => {
          data.push(chunk);
        });

        response.on('end', () => {
          const responseData = JSON.parse(Buffer.concat(data).toString());
          if (isAccessData(responseData)) {
            resolve(responseData);
          } else {
            console.error(responseData);
            reject('Wrong format in response');
          }
        });
        response.on('error', (error: Error) => {
          console.error('requestAccessDataResponse', error);
          reject(error);
        });
      });

      request.on('error', (error: Error) => {
        console.error('requestAccessData', error);
        reject(error);
      });

      request.write(HseAuth.getURLEncodedParams(grant_type, additional_data));

      request.end();
    });
  }

  public static async authorizeByRedirectUrl(redirectUrl: string) {
    const code = HseAuth.getCodeFromUrl(redirectUrl);
    const accessData = await HseAuth.requestAccessData('authorization_code', { code });
    try {
      Vault.saveAccessData(accessData);
    } catch (err) {
      console.error(err);
    }
  }

  public static async refreshAccessData() {
    return new Promise((resolve, reject) => {
      if (!HseAuth.isTokenValid('refresh')) {
        throw 'refresh is not valid';
      }

      HseAuth.requestAccessData('refresh_token', {
        refresh_token: Vault.getToken('refresh').token,
      })
        .then((accessData) => {
          Vault.saveAccessData(accessData);
          resolve(true);
        })
        .catch((error) => {
          console.error('Something went wrong during refreshing auth data:', error);
          reject(error);
        });
    });
  }

  public static isTokenValid(token_type: 'access' | 'refresh') {
    try {
      Vault.getToken(token_type);
    } catch {
      console.log(`${token_type} token is not set`);
      return false;
    }

    if (HseAuth.isExpiredToken(token_type)) {
      console.log(`${token_type} token is expired`);
      return false;
    } else {
      return true;
    }
  }

  public static isExpiredToken(tokenType: 'access' | 'refresh'): boolean {
    const token = Vault.getToken(tokenType);
    return token.retrieved_at.getTime() + token.expires_in * 1000 < new Date().getTime();
  }

  public static async authorize() {
    return new Promise<boolean>((resolve, reject) => {
      if (HseAuth.isTokenValid('access')) {
        resolve(true);
      } else {
        console.log('Trying to refresh access data...');
        HseAuth.refreshAccessData()
          .then(() => resolve(true))
          .catch((_) => {
            reject(false);
          });
      }
    });
  }

  private static getURLEncodedParams(
    grant_type: 'refresh_token' | 'authorization_code',
    additional_data: { refresh_token: string } | { code: string },
  ) {
    const params = {
      redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
      grant_type,
      client_id: CLIENT_ID,
      ...additional_data,
    };
    const urlEncodedParams = new URLSearchParams(params).toString();
    return urlEncodedParams;
  }

  private static getStdAuthURL() {
    const url = new URL('https://saml.hse.ru/realms/hse/protocol/openid-connect/auth');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
      scope: 'profile email',
    });
    url.search = params.toString();

    return url.toString();
  }

  public static openAuthBrowserExternal() {
    shell.openExternal(HseAuth.getStdAuthURL());
  }

  public static leave() {
    Vault.resetTokens();
    sendLeaveEvent();
  }
}
