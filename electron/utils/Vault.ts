import Store from 'electron-store';
import { safeStorage } from 'electron';
import type { AccessData, Token } from '../types';
import { env_secret_key } from '../config';

export class Vault {
  protected static store = new Store({
    encryptionKey: env_secret_key,
  });

  public static saveAccessData(data: AccessData) {
    const {
      access_token,
      refresh_token,
      refresh_token_expires_in,
      expires_in,
      id_token,
    } = data;

    this.store.set(
      'access_token',
      safeStorage.encryptString(access_token).toString('latin1'),
    );
    this.store.set(
      'refresh_token',
      safeStorage.encryptString(refresh_token).toString('latin1'),
    );
    this.store.set(
      'id_token',
      safeStorage.encryptString(id_token).toString('latin1'),
    );
    this.store.set('access_expires', expires_in);
    this.store.set('refresh_expires', refresh_token_expires_in);
    this.store.set('access_retrieved', new Date().getTime());
    this.store.set('refresh_retrieved', new Date().getTime());
  }

  public static getToken(tokenType: 'access' | 'refresh'): Token {
    const token = this.store.get(`${tokenType}_token`) as string;
    if (!token) {
      throw new Error(`token is not set for ${tokenType}`);
    }

    const expires_in = Number(this.store.get(`${tokenType}_expires`) as string);
    if (!expires_in) {
      throw new Error(`expires_in is not set for ${tokenType}`);
    }

    const retrieved_at = new Date(
      this.store.get(`${tokenType}_retrieved`) as number,
    );
    if (!retrieved_at) {
      throw new Error(`retrieved_at is not set for ${tokenType}`);
    }

    const decrypted_token = safeStorage.decryptString(
      Buffer.from(token, 'latin1'),
    );

    return { token: decrypted_token, expires_in, retrieved_at };
  }

  public static isAuthorized() {
    return !!this.getToken('access');
  }
}
