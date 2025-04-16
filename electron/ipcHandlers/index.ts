import { handleApi } from './api';
import { handleAuth } from './auth';

export function initHandlers() {
  handleAuth();
  handleApi();
}
