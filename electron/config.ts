import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

if (!existsSync(resolve(__dirname, '../.env'))) {
  throw 'Environment configuration file is absent';
}

dotenv.config({ path: resolve(__dirname, '../.env') });

const config = dotenv.config({ path: resolve(__dirname, '../.env') }).parsed;

if (!config?.CLIENT_ID || !config?.SECRET_KEY) {
  throw new Error('Required environment variables are not set');
}

export const CLIENT_ID = config.CLIENT_ID || 'null';
export const SECRET_KEY = config.SECRET_KEY || 'null';
