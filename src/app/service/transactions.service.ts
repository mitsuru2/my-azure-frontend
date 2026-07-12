import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap, timer } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { API_BASE_URL } from './api-config';
import { OrchestrationStartResponse, OrchestrationStatusResponse, TransactionsRequest } from './models';

const POLLING_INTERVAL_MS = 2000;

const TERMINAL_STATUSES = new Set(['Completed', 'Failed', 'Terminated']);

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);

  /** CSVファイルをBase64エンコードする。 */
  encodeFileAsBase64(file: File): Observable<string> {
    return from(file.arrayBuffer()).pipe(map((buffer) => arrayBufferToBase64(buffer)));
  }

  /** POSTで処理を起動し、完了するまでステータスをポーリングする。 */
  submit(request: TransactionsRequest): Observable<OrchestrationStatusResponse> {
    return this.http
      .post<OrchestrationStartResponse>(`${API_BASE_URL}/transactions`, request)
      .pipe(switchMap((start) => this.pollStatus(start.statusQueryGetUri)));
  }

  private pollStatus(statusQueryGetUri: string): Observable<OrchestrationStatusResponse> {
    return timer(0, POLLING_INTERVAL_MS).pipe(
      switchMap(() => this.http.get<OrchestrationStatusResponse>(statusQueryGetUri)),
      first((status) => TERMINAL_STATUSES.has(status.runtimeStatus)),
    );
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
