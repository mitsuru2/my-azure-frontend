import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { primeNgLicense } from '../_license';
import { MyPreset } from '../styles';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    providePrimeNG({
      license: primeNgLicense,
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p', // CSS変数のプリフィックス。 var(--p-primary-color)
          darkModeSelector: false, // ダークモードOFF
          cssLayer: false, // 素のCSS/SCSSを使用。CSSスタイル名の衝突回避のためのレイヤーを作らない。
          cssVariables: true, // トークンをCSS変数として出力する。
        },
      },
      inputVariant: 'filled',
    }),
  ],
};
