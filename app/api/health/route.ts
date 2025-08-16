// app/api/health/route.ts
// ...
// E2B status: key present → ok = true; missing → ok = false
const e2bKey = process.env.E2B_API_KEY;
services.e2b = e2bKey
  ? { ok: true }
  : { ok: false, error: 'Missing E2B_API_KEY' };

// Supabase status: both keys present → ok = true; missing → ok = false
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
services.supabase = supabaseUrl && supabaseAnonKey
  ? { ok: true }
  : { ok: false, error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' };

// overall status is "ok" only if all services report ok = true
const status = Object.values(services).every((svc: any) => svc?.ok)
  ? 'ok'
  : 'error';

return NextResponse.json({ status, services });
