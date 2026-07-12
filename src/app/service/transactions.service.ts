import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, of, switchMap, timer } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { API_BASE_URL } from './api-config';
import {
  OrchestrationStartResponse,
  OrchestrationStatusResponse,
  TransactionsCompletedResponse,
  TransactionsRequest,
  TransactionsResult,
} from './models';

const POLLING_INTERVAL_MS = 2000;

const TERMINAL_STATUSES = new Set(['Completed', 'Failed', 'Terminated']);

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);

  /** CSVファイルをBase64エンコードする。 */
  encodeFileAsBase64(file: File): Observable<string> {
    return from(file.arrayBuffer()).pipe(map((buffer) => arrayBufferToBase64(buffer)));
  }

  /**
   * POSTで処理を起動する。
   * 202 (Accepted) の場合はステータスをポーリングして完了を待つが、
   * 処理が短時間で終わり 200 (OK) で完了レスポンス (`{ addedCount }`) が返る場合はポーリングを行わない。
   */
  submit(request: TransactionsRequest): Observable<TransactionsResult> {
    return this.http
      .post<OrchestrationStartResponse | TransactionsCompletedResponse>(
        `${API_BASE_URL}/transactions`,
        request,
        { observe: 'response' },
      )
      .pipe(
        switchMap((response) =>
          response.status === 200
            ? of<TransactionsResult>({ runtimeStatus: 'Completed', output: response.body })
            : this.pollStatus((response.body as OrchestrationStartResponse).statusQueryGetUri),
        ),
      );
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
