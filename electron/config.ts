import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

export const env_client_id = process.env.CLIENT_ID || 'null';
export const env_secret_key = process.env.SECRET_KEY || 'null';
