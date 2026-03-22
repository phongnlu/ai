import { recordSuccess, recordError } from '@/lib/cronStatus';

function nextRunDate(schedule: string): Date {
  // Simple approximation: parse the */N hour pattern, otherwise default to +6h
  const match = schedule.match(/0 \*\/(\d+) \* \* \*/);
  const hours = match ? parseInt(match[1], 10) : 6;
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

  // Then on schedule (default: every 6 hours)
  cron.schedule(schedule, run);

  console.log(`[instrumentation] Pipeline scheduled: startup + "${schedule}"`);
}
