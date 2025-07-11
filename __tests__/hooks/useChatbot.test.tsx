import { renderHook, act } from '@testing-library/react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatMessage } from '@/types';

describe('useChatbot', () => {
  const mockMessage: ChatMessage = {
    id: 'test-1',
    type: 'text',
    role: 'user',
    content: 'Test message',
    timestamp: new Date(),
  };

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.chatEndRef.current).toBeNull();
  });

  it('adds single message', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    act(() => {
      result.current.addMessage(mockMessage);
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual(mockMessage);
  });

  it('adds multiple messages', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    const messages = [mockMessage, { ...mockMessage, id: 'test-2' }];
    
    act(() => {
      result.current.addMessages(messages);
    });
    
    expect(result.current.messages).toHaveLength(2);
  });

  it('sets loading state', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.loading).toBe(true);
  });

  it('sets error state', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    act(() => {
      result.current.setError('Test error');
    });
    
    expect(result.current.error).toBe('Test error');
  });

  it('clears error', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    act(() => {
      result.current.setError('Test error');
      result.current.clearError();
    });
    
    expect(result.current.error).toBe('');
  });

  it('resets chat state', () => {
    const { result } = renderHook(() => useChatbot(true));
    
    act(() => {
      result.current.addMessage(mockMessage);
      result.current.setLoading(true);
      result.current.setError('Test error');
      result.current.resetChat();
    });
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('resets when chat is closed', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useChatbot(isOpen),
      { initialProps: { isOpen: true } }
    );
    
    act(() => {
      result.current.addMessage(mockMessage);
      result.current.setLoading(true);
      result.current.setError('Test error');
    });
    
    // Close the chat
    rerender({ isOpen: false });
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });
});