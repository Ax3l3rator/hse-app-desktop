import { CLIENT_ID_R, SECRET_KEY_R } from './.env';

if (!CLIENT_ID_R || !SECRET_KEY_R) {
  throw new Error('Required environment variables are not set');
}

export const CLIENT_ID = CLIENT_ID_R;
export const SECRET_KEY = SECRET_KEY_R;
