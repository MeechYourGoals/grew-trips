import { vi, describe, it, expect } from 'vitest';

vi.mock('../../hooks/useMessages');
vi.mock('../../services/OpenAIService', () => ({
  OpenAIService: { queryOpenAI: vi.fn() }
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiMessageComposer } from '../../components/AiMessageComposer';
import { useMessages } from '../../hooks/useMessages';
import { OpenAIService } from '../../services/OpenAIService';


describe('AiMessageComposer', () => {
  it('calls addMessage and clears the prompt after send', async () => {
    const addMessage = vi.fn();
    vi.mocked(useMessages).mockReturnValue({ 
      addMessage,
      messages: [],
      scheduledMessages: [],
      searchQuery: '',
      getMessagesForTour: vi.fn(),
      getMessagesForTrip: vi.fn(),
      scheduleMessage: vi.fn(),
      searchMessages: vi.fn(),
      markAsRead: vi.fn(),
      getTotalUnreadCount: vi.fn(),
      getTripUnreadCount: vi.fn()
    });
    vi.mocked(OpenAIService.queryOpenAI).mockResolvedValue('response');

    render(<AiMessageComposer participants={[{ id: '1', name: 'Test User' }]} />);
    const textarea = screen.getByPlaceholderText('Ask the AI to craft a message...') as HTMLTextAreaElement;
    const recipientSelect = screen.getByRole('listbox');
    fireEvent.change(recipientSelect, { target: { value: '1' } });
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledWith('response', undefined, undefined, {
        type: 'individual',
        userIds: ['1'],
      });
    });

    expect(textarea.value).toBe('');
  });
});
