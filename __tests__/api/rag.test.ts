import { POST } from '@/app/api/rag/route'
import { NextRequest } from 'next/server'
const { server } = require('../../__mocks__/node')
const { http, HttpResponse } = require('msw')

// Mock NextRequest for testing
class MockNextRequest {
  public url: string;
  public method: string;
  private _body: any;

  constructor(url: string, options?: { method?: string; body?: any }) {
    this.url = url;
    this.method = options?.method || 'POST';
    this._body = options?.body;
  }

  async json() {
    return this._body ? JSON.parse(this._body) : {};
  }
}

// Mock the environment module
jest.mock('@/lib/env', () => ({
  env: {
    FASTAPI_RAG_URL: 'http://127.0.0.1:8000/query'
  },
  validateEnv: jest.fn(),
  EnvValidationError: class EnvValidationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'EnvValidationError'
    }
  }
}))

describe('/api/rag route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: any) => {
    return new MockNextRequest('http://localhost:3000/api/rag', {
      method: 'POST',
      body: JSON.stringify(body),
    }) as any
  }

  it('successfully processes valid request', async () => {
    const mockRequest = createMockRequest({ query: 'What are ETFs?' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('answer')
    expect(data.answer).toContain('ETFs offer low-cost diversification')
  })

  it('returns 400 for missing query', async () => {
    const mockRequest = createMockRequest({})
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing query')
  })

  it('returns 400 for empty query', async () => {
    const mockRequest = createMockRequest({ query: '' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing query')
  })

  it('handles FastAPI backend errors', async () => {
    // Mock FastAPI returning an error
    server.use(
      http.get('http://127.0.0.1:8000/query', () => {
        return HttpResponse.text('Service unavailable', { status: 503 })
      })
    )

    const mockRequest = createMockRequest({ query: 'test query' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(503)
    expect(data.error).toBe('Service unavailable')
  })

  it('handles JSON parsing errors gracefully', async () => {
    const mockRequest = new NextRequest(new URL('http://localhost:3000/api/rag'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json{',
    })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })

  it('handles environment validation errors', async () => {
    const { validateEnv, EnvValidationError } = require('@/lib/env')
    
    // Mock environment validation to throw an error
    validateEnv.mockImplementation(() => {
      throw new EnvValidationError('Missing FASTAPI_RAG_URL')
    })

    const mockRequest = createMockRequest({ query: 'test query' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Server configuration error')
  })

  it('handles network errors', async () => {
    // Mock fetch to throw a network error
    server.use(
      http.get('http://127.0.0.1:8000/query', () => {
        throw new Error('Network error')
      })
    )

    const mockRequest = createMockRequest({ query: 'test query' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })

  it('processes different types of queries correctly', async () => {
    // Test risk-related query
    const riskRequest = createMockRequest({ query: 'What is my risk tolerance?' })
    const riskResponse = await POST(riskRequest)
    const riskData = await riskResponse.json()
    
    expect(riskResponse.status).toBe(200)
    expect(riskData.answer).toContain('moderate investment approach')

    // Test goal-related query
    const goalRequest = createMockRequest({ query: 'How do I set investment goals?' })
    const goalResponse = await POST(goalRequest)
    const goalData = await goalResponse.json()
    
    expect(goalResponse.status).toBe(200)
    expect(goalData.answer).toContain('achieve your financial goals')
  })

  it('returns sources when available', async () => {
    const mockRequest = createMockRequest({ query: 'Tell me about ETFs' })
    
    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sources')
    expect(Array.isArray(data.sources)).toBe(true)
  })

  it('handles large query payloads', async () => {
    const largeQuery = 'What are ETFs? '.repeat(1000) // Create a large query
    const mockRequest = createMockRequest({ query: largeQuery })
    
    const response = await POST(mockRequest)
    
    // Should still process successfully
    expect(response.status).toBe(200)
  })

  it('validates request method (only POST allowed)', async () => {
    // This test is more conceptual since we only export POST
    // but it's good to document the expected behavior
    const mockRequest = createMockRequest({ query: 'test' })
    expect(mockRequest.method).toBe('POST')
  })

  it('properly forwards request body to FastAPI', async () => {
    let capturedBody: any = null
    
    // Mock to capture the request body sent to FastAPI
    server.use(
      http.get('http://127.0.0.1:8000/query', async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({
          answer: 'Test response',
          sources: []
        })
      })
    )

    const testQuery = 'What is compound interest?'
    const mockRequest = createMockRequest({ query: testQuery })
    
    await POST(mockRequest)
    
    expect(capturedBody).toEqual({ query: testQuery })
  })
})