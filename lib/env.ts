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
    throw new EnvValidationError(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (invalidVars.length > 0) {
    throw new EnvValidationError(
      `Invalid environment variables: ${invalidVars.join(', ')}`
    );
  }

  return requiredEnvVars;
}

// Validated environment configuration
export const env = {
  FASTAPI_RAG_URL: process.env.FASTAPI_RAG_URL || 'http://127.0.0.1:8000/query',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
};

// Note: Validation is performed at request time in API routes
// to avoid build-time errors when environment variables are not set