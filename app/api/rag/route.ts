import { NextRequest, NextResponse } from 'next/server';
import { env, validateEnv, EnvValidationError } from '@/lib/env';

// CORS headers for Vercel deployment
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // Validate environment configuration
    validateEnv();
    
    const body = await req.json();
    const { query, userContext } = body;
    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400, headers: corsHeaders });
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
      let errorMessage = 'The AI service encountered an error';
      
      try {
        const errorText = await apiRes.text();
        // Try to parse as JSON first
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.error || errorMessage;
        } catch {
          // If not JSON, use the text directly if it's not too long
          if (errorText && errorText.length < 200) {
            errorMessage = errorText;
          }
        }
      } catch {
        // If we can't read the error response, use status-based message
        if (apiRes.status === 404) {
          errorMessage = 'The AI service endpoint was not found. Please check the backend configuration.';
        } else if (apiRes.status === 401 || apiRes.status === 403) {
          errorMessage = 'Authentication failed with the AI service.';
        } else if (apiRes.status >= 500) {
          errorMessage = 'The AI service is currently unavailable. Please try again later.';
        }
      }
      
      console.error(`RAG API error (${apiRes.status}):`, errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: apiRes.status, headers: corsHeaders });
    }
    const data = await apiRes.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error: unknown) {
    if (error instanceof EnvValidationError) {
      console.error('Environment validation error:', error.message);
      
      // Provide helpful message for Vercel deployment
      const isVercel = process.env.VERCEL === '1';
      const helpMessage = isVercel 
        ? 'The AI assistant is not configured. Please add FASTAPI_RAG_URL and NEXT_PUBLIC_API_URL environment variables in your Vercel project settings.'
        : 'Server configuration error: Missing required environment variables.';
      
      return NextResponse.json(
        { error: helpMessage }, 
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Handle fetch errors (network issues)
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        const apiUrl = env.NEXT_PUBLIC_API_URL || 'backend service';
        return NextResponse.json(
          { error: `Unable to connect to the AI service at ${apiUrl}. Please ensure the backend is running and accessible.` }, 
          { status: 503, headers: corsHeaders }
        );
      }
      
      // DNS errors or other network issues
      if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        return NextResponse.json(
          { error: 'Cannot reach the AI service. Please check if the backend URL is correct in your environment configuration.' }, 
          { status: 503, headers: corsHeaders }
        );
      }
    }
    
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('RAG API error:', message);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again later.' }, { status: 500, headers: corsHeaders });
  }
}
