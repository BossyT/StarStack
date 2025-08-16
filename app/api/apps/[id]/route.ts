import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const appId = params.id;
    const { data: files, error } = await supabase
      .from('app_files')
      .select('path, content')
      .eq('app_id', appId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, files });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
