import { checkType } from './TypeChecker';

export type AccessData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  resource: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  id_token: string;
};

const pattern: AccessData = {
  access_token: 'dummy',
  token_type: 'dummy',
  expires_in: 1,
  resource: 'dummy',
  refresh_token: 'dummy',
  refresh_token_expires_in: 1,
  id_token: 'dummy',
};

export function isAccessData(object: object): object is AccessData {
  return checkType(object, pattern);
}
