import { NextRequest, NextResponse } from 'next/server';
import { env, validateEnv, EnvValidationError } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    // Validate environment configuration
    validateEnv();
    
    const body = await req.json();
    const { query, userContext } = body;
    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }
    
    // Prepare request payload with optional user context
    const requestPayload: { query: string; userContext?: any } = { query };
    if (userContext) {
      requestPayload.userContext = userContext;
    }
    
    const apiRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    });
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      return NextResponse.json({ error: errorText }, { status: apiRes.status });
    }
    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof EnvValidationError) {
      console.error('Environment validation error:', error.message);
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
