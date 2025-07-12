// Environment variable validation and configuration

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

export function validateEnv() {
  const requiredEnvVars = {
    FASTAPI_RAG_URL: process.env.FASTAPI_RAG_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
      continue;
    }

    // Validate URL format for API endpoints
    if (key === 'FASTAPI_RAG_URL' || key === 'NEXT_PUBLIC_API_URL') {
      try {
        new URL(value);
      } catch {
        invalidVars.push(`${key}: must be a valid URL`);
      }
    }
  }

  if (missingVars.length > 0) {
    const isVercel = process.env.VERCEL === '1';
    const baseMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    const helpMessage = isVercel
      ? `${baseMessage}\n\nTo fix this on Vercel:\n1. Go to your Vercel project settings\n2. Navigate to Environment Variables\n3. Add the missing variables:\n   - FASTAPI_RAG_URL: Your FastAPI backend URL (e.g., https://your-backend.onrender.com/query)\n   - NEXT_PUBLIC_API_URL: Your FastAPI base URL (e.g., https://your-backend.onrender.com)`
      : `${baseMessage}\n\nPlease set these in your .env.local file for local development.`;
    
    throw new EnvValidationError(helpMessage);
  }

  if (invalidVars.length > 0) {
    const isVercel = process.env.VERCEL === '1';
    const baseMessage = `Invalid environment variables: ${invalidVars.join(', ')}`;
    const helpMessage = isVercel
      ? `${baseMessage}\n\nPlease check your Vercel environment variables and ensure all URLs are properly formatted (e.g., https://example.com).`
      : `${baseMessage}\n\nPlease check your .env.local file and ensure all URLs are properly formatted.`;
    
    throw new EnvValidationError(helpMessage);
  }

  return requiredEnvVars;
}

// Validated environment configuration with sensible defaults
export const env = {
  FASTAPI_RAG_URL: process.env.FASTAPI_RAG_URL || 'http://127.0.0.1:8000/query',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://investim-rag.onrender.com',
};

// Note: Validation is performed at request time in API routes
// to avoid build-time errors when environment variables are not set.
// On Vercel, ensure these variables are configured in your project settings.