import { recordSuccess, recordError } from '@/lib/cronStatus';

function nextRunDate(schedule: string): Date {
  // Parse common patterns: "0 * * * *" (hourly), "0 */N * * *" (every N hours)
  if (schedule === '0 * * * *') return new Date(Date.now() + 60 * 60 * 1000);
  const match = schedule.match(/0 \*\/(\d+) \* \* \*/);
  const hours = match ? parseInt(match[1], 10) : 1;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export async function register() {
  // Only run in the Node.js runtime (not edge) and in production
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return;

  const { default: cron } = await import('node-cron');
  const { runPipeline } = await import('./agents/pipeline');

  const schedule = process.env.CRON_SCHEDULE ?? '0 * * * *';

  const run = async () => {
    console.log('[cron] Running pipeline...');
    try {
      const articles = await runPipeline();
      recordSuccess(articles.length, nextRunDate(schedule));
      console.log(`[cron] Done — ${articles.length} articles`);
    } catch (err) {
      recordError(err, nextRunDate(schedule));
      console.error('[cron] Pipeline error:', err);
    }
  };

  // Run once on startup (5s delay to let server fully initialize)
  setTimeout(run, 5_000);

  // Then on schedule (default: every hour)
  cron.schedule(schedule, run);

  console.log(`[instrumentation] Pipeline scheduled: startup + "${schedule}"`);
}
