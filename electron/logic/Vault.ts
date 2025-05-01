import Store from 'electron-store';
import { safeStorage } from 'electron';
import { type AccessData, type Token } from '../types';
import { SECRET_KEY } from '../config';

export class Vault {
  protected static store = new Store({
    name: 'auth-store',
    watch: true,
    fileExtension: 'json',
    encryptionKey: SECRET_KEY,
  });

  public static saveAccessData(data: AccessData) {
    const { access_token, expires_in } = data;
    const { refresh_token, refresh_expires_in } = data;
    Vault.store.set('refresh_expires', refresh_expires_in);
    Vault.store.set('refresh_token', safeStorage.encryptString(refresh_token).toString('latin1'));
    Vault.store.set('refresh_retrieved', new Date().getTime());

    Vault.store.set('access_token', safeStorage.encryptString(access_token).toString('latin1'));
    Vault.store.set('access_expires', expires_in);
    Vault.store.set('access_retrieved', new Date().getTime());
  }

  public static getToken(tokenType: 'access' | 'refresh'): Token {
    const token = Vault.store.get(`${tokenType}_token`) as string;
    if (!token) {
      throw new Error(`token is not set for ${tokenType}`);
    }

    const expires_in = Number(Vault.store.get(`${tokenType}_expires`) as string);
    if (!expires_in) {
      throw new Error(`expires_in is not set for ${tokenType}`);
    }

    const retrieved_at = new Date(Vault.store.get(`${tokenType}_retrieved`) as number);
    if (!retrieved_at) {
      throw new Error(`retrieved_at is not set for ${tokenType}`);
    }

    const decrypted_token = safeStorage.decryptString(Buffer.from(token, 'latin1'));

    return { token: decrypted_token, expires_in, retrieved_at };
  }

  public static resetTokens() {
    Vault.store.delete('access_token');
    Vault.store.delete('refresh_token');
    Vault.store.delete('access_expires');
    Vault.store.delete('refresh_expires');
    Vault.store.delete('access_retrieved');
    Vault.store.delete('refresh_retrieved');
  }
}
