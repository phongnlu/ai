export interface CronStatus {
  lastRunAt: string | null;
  lastRunResult: 'success' | 'error' | null;
  lastRunCount: number | null;
  lastRunError: string | null;
  nextRunAt: string | null;
  schedule: string;
}

const status: CronStatus = {
  lastRunAt: null,
  lastRunResult: null,
  lastRunCount: null,
  lastRunError: null,
  nextRunAt: null,
  schedule: process.env.CRON_SCHEDULE ?? '0 */6 * * *',
};

export function getCronStatus(): CronStatus {
  return { ...status };
}

export function recordSuccess(count: number, nextRunAt: Date): void {
  status.lastRunAt = new Date().toISOString();
  status.lastRunResult = 'success';
  status.lastRunCount = count;
  status.lastRunError = null;
  status.nextRunAt = nextRunAt.toISOString();
}

export function recordError(err: unknown, nextRunAt: Date): void {
  status.lastRunAt = new Date().toISOString();
  status.lastRunResult = 'error';
  status.lastRunCount = null;
  status.lastRunError = err instanceof Error ? err.message : String(err);
  status.nextRunAt = nextRunAt.toISOString();
}
