import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { safeRoute } from '@/lib/safeRoute';

export const runtime = 'edge';

export const POST = safeRoute(async (req: NextRequest) => {
  const { id, url, files } = await req.json();

  // Upsert main app record
  const { error: appError } = await supabase
    .from('generated_apps')
    .upsert({ id, url });
  if (appError) throw new Error(appError.message);

  // Insert files (replace existing on conflict)
  if (Array.isArray(files)) {
    const fileRecords = files.map((f: any) => ({
      app_id: id,
      path: f.path,
      content: f.content,
    }));
    const { error: fileError } = await supabase
      .from('app_files')
      .insert(fileRecords, { onConflict: 'app_id_path' });
    if (fileError) throw new Error(fileError.message);
  }

  return NextResponse.json({ success: true });
});
