import { checkType } from './TypeChecker';

export type RefreshData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
};

const pattern: RefreshData = {
  access_token: 'dummy',
  token_type: 'dummy',
  expires_in: 1,
  id_token: 'dummy',
};

export function isRefreshData(object: object): object is RefreshData {
  return checkType(object, pattern);
}
