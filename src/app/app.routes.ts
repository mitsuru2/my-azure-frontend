import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/home/home').then((m) => m.Home),
  },
  {
    path: 'health',
    loadComponent: () => import('./page/health/health').then((m) => m.Health),
  },
  {
    path: 'stock-price',
    loadComponent: () => import('./page/stock-price/stock-price').then((m) => m.StockPrice),
  },
  {
    path: 'transactions',
    loadComponent: () => import('./page/transactions/transactions').then((m) => m.Transactions),
  },
];
