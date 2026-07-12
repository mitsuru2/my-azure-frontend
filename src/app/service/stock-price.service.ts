import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api-config';
import { Market, StockPriceResponse } from './models';

@Injectable({ providedIn: 'root' })
export class StockPriceService {
  private readonly http = inject(HttpClient);

  getStockPrice(market: Market, ticker: string): Observable<StockPriceResponse> {
    return this.http.get<StockPriceResponse>(`${API_BASE_URL}/stock-price`, {
      params: { market, ticker },
    });
  }
}
