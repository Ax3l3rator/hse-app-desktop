import { checkType } from './TypeChecker';

export type AccessData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
  session_state: string;
  'not-before-policy': number;
};

const pattern: AccessData = {
  access_token: 'dummy',
  token_type: 'dummy',
  expires_in: 1,
  refresh_token: 'dummy',
  refresh_expires_in: 1,
  scope: 'string',
  session_state: 'string',
  'not-before-policy': 1,
};

export function isAccessData(object: object): object is AccessData {
  return checkType(object, pattern);
}
