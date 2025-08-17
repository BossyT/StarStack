type LogLevel = 'info' | 'warn' | 'error';

export async function log(level: LogLevel, message: string, details?: any) {
  try {
    const line = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
    if (level === 'error') console.error(line, details ?? '');
    else if (level === 'warn') console.warn(line, details ?? '');
    else console.log(line, details ?? '');

    const url = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_ANON_KEY;
    if (!url || !anon) return;

    await fetch(`${url}/rest/v1/logs`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify([{ level, message, details }]),
      cache: 'no-store',
    });
  } catch (e) {
    console.error('Logger failed', e);
  }
}
