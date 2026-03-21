export async function register() {
  // Only run in the Node.js runtime (not edge), and only in production
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return;

  const { default: cron } = await import('node-cron');
  const { runPipeline } = await import('./agents/pipeline');

  const run = () =>
    runPipeline().catch((err) => console.error('[cron] Pipeline error:', err));

  // Run once on startup (5s delay to let server fully initialize)
  setTimeout(run, 5_000);

  // Then every 6 hours
  cron.schedule('0 */6 * * *', run);

  console.log('[instrumentation] Pipeline scheduled: startup + every 6h');
}
