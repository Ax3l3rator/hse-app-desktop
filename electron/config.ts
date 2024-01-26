import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

export const CLIENT_ID = process.env.CLIENT_ID || 'null';
export const SECRET_KEY = process.env.SECRET_KEY || 'null';
