import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const config = dotenv.config({ path: resolve(__dirname, '../.env') }).parsed;

export const CLIENT_ID = config?.CLIENT_ID || 'null';
export const SECRET_KEY = config?.SECRET_KEY || 'null';
