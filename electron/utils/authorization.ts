import { net } from 'electron';
import { isAccessData } from '../types/AccessData';
import * as jwt from 'jsonwebtoken';
import { env_client_id } from '../config';
import { Vault } from './Vault';
import type { AccessData } from '../types/AccessData';

function getCodeFromUrl(url: string): string {
  const code = new URL(url).searchParams.get('code');
  if (!code) throw new Error('Code Parsing went wrong!');
  return code;
}

export async function requestAccessData(url: string) {
  return new Promise<AccessData>((resolve, reject) => {
    const code = getCodeFromUrl(url);

    const request = net.request({
      url: 'https://auth.hse.ru/adfs/oauth2/token/',
      method: 'POST',
    });
    const params = {
      code: code,
      client_id: env_client_id,
      redirect_uri: 'ruz-app-fiddle://auth.hse.ru/adfs/oauth2/callback',
      grant_type: 'authorization_code',
    };

    const urlEncodedParams = new URLSearchParams(params).toString();

    request.on('response', (response) => {
      const data: Buffer[] = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const accessData = JSON.parse(Buffer.concat(data).toString());

        if (isAccessData(accessData)) {
          const decoded = jwt.decode((accessData as AccessData).id_token, {
            complete: true,
          });

          resolve(accessData);
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
    request.write(urlEncodedParams);

    request.end();
  });
}

export async function authorizeByRedirectUrl(redirectUrl: string) {
  const accessData = await requestAccessData(redirectUrl);
  console.log(accessData);
  Vault.saveAccessData(accessData);
  console.log(Vault.getToken('access'));
}
