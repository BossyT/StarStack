import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { safeRoute } from '@/lib/safeRoute';

export const runtime = 'edge';

export const GET = safeRoute(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const id = params.id;
  const { data, error } = await supabase
    .from('app_files')
    .select('path,content')
    .eq('app_id', id);

  if (error) throw new Error(error.message);
  return NextResponse.json({ files: data ?? [] });
});
