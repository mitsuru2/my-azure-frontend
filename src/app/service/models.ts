export interface HealthResponse {
  product: string;
  version: string;
  status: 'healthy';
}

export type Market = 'TSE' | 'JIAA' | 'NYSE' | 'NYSE_ARCA' | 'NASDAQ';

export const MARKETS: { label: string; value: Market }[] = [
  { label: 'TSE (東京証券取引所)', value: 'TSE' },
  { label: 'JIAA (投資信託)', value: 'JIAA' },
  { label: 'NYSE', value: 'NYSE' },
  { label: 'NYSE_ARCA', value: 'NYSE_ARCA' },
  { label: 'NASDAQ', value: 'NASDAQ' },
];

export interface StockPriceResponse {
  market: string;
  ticker: string;
  price: number | null;
  currency: string | null;
  timestamp: string;
  error?: string | null;
}

export interface TransactionsRequest {
  format: 'SBI';
  account: string;
  /** UTF-8テキストをBase64エンコードしたもの */
  csv: string;
}

export interface ErrorResponse {
  error: string;
}

/** Durable Functions オーケストレーター起動レスポンス。 */
export interface OrchestrationStartResponse {
  id: string;
  statusQueryGetUri: string;
  sendEventPostUri?: string;
  terminatePostUri?: string;
  purgeHistoryDeleteUri?: string;
  restartPostUri?: string;
}

export type RuntimeStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Terminated';

/** Durable Functions 標準のステータス確認レスポンス。 */
export interface OrchestrationStatusResponse {
  name: string;
  instanceId: string;
  runtimeStatus: RuntimeStatus;
  input?: unknown;
  customStatus?: unknown;
  output?: unknown;
  createdTime: string;
  lastUpdatedTime: string;
}

/** 処理が短時間で同期的に完了した場合に 200 (OK) で返るレスポンス。 */
export interface TransactionsCompletedResponse {
  addedCount: number;
}

/** transactions処理の結果 (画面表示に必要な最小限のフィールド)。 */
export interface TransactionsResult {
  runtimeStatus: RuntimeStatus;
  output?: unknown;
}
