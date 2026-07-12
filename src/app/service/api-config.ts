import { isDevMode } from '@angular/core';

/** api/openapi.yaml の servers に対応するAPIベースURL。 */
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:7071/api'
  : 'https://ti7d2zarxv6ke-functions.azurewebsites.net/api';
