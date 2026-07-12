import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Play } from '@primeicons/angular/play';
import { Spinner } from '@primeicons/angular/spinner';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';

import { StockPriceService } from '../../service/stock-price.service';
import { MARKETS, Market, StockPriceResponse } from '../../service/models';
import { i18n } from '../../../locale/_i18n_';

@Component({
  selector: 'app-stock-price',
  imports: [RouterLink, FormsModule, ButtonDirective, Card, InputText, Message, Select, Play, Spinner],
  templateUrl: './stock-price.html',
  styleUrl: './stock-price.scss',
})
export class StockPrice {
  protected readonly i18n = i18n;

  private readonly stockPriceService = inject(StockPriceService);

  protected readonly markets = MARKETS;
  protected readonly market = signal<Market>('TSE');
  protected readonly ticker = signal('');

  protected readonly loading = signal(false);
  protected readonly result = signal<StockPriceResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  execute(): void {
    if (!this.ticker().trim()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.stockPriceService.getStockPrice(this.market(), this.ticker().trim()).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const body: StockPriceResponse | undefined = err.error;
        if (body?.error) {
          this.result.set(body);
        } else {
          this.error.set(err.message);
        }
        this.loading.set(false);
      },
    });
  }
}
