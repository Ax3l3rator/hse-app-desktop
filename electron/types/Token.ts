import { checkType, type TypeChecker } from './TypeChecker';

export type Token = {
  token: string;
  expires_in: number;
  retrieved_at: Date;
};

const pattern: Token = {
  token: 'string',
  expires_in: 0,
  retrieved_at: new Date(),
};

export function isToken(object: object): object is Token {
  return checkType(object, pattern);
}
