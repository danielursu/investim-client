// Simple test to verify Jest setup
describe('Jest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have access to DOM APIs', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })

  it('should support async/await', async () => {
    const promise = Promise.resolve('test')
    const result = await promise
    expect(result).toBe('test')
  })
})