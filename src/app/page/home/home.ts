import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';

interface ApiLink {
  path: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly links: ApiLink[] = [
    { path: '/health', title: 'health', description: 'ヘルスチェック (GET /health)' },
    {
      path: '/stock-price',
      title: 'stock-price',
      description: '株価・投資信託基準価額の取得 (GET /stock-price)',
    },
    {
      path: '/transactions',
      title: 'transactions',
      description: '入出金明細CSVの取り込み (POST /transactions)',
    },
  ];
}
