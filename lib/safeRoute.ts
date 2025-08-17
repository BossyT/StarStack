import { NextResponse } from 'next/server';
import { log } from './logger';

export function safeRoute<TArgs extends any[]>(
  handler: (...args: TArgs) => Promise<Response> | Response
) {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (err: any) {
      await log('error', 'API route crashed', { error: err?.message, stack: err?.stack });
      return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
    }
  };
}
