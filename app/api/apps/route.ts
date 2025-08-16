import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { id, url, files } = await req.json();
    // Insert or upsert main app record
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
        .insert(fileRecords, { onConflict: 'app_id,path' });
      if (fileError) throw new Error(fileError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
