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
    vi.mocked(useMessages).mockReturnValue({ addMessage });
    vi.mocked(OpenAIService.queryOpenAI).mockResolvedValue('response');

    render(<AiMessageComposer />);
    const textarea = screen.getByPlaceholderText('Ask the AI to craft a message...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledWith('response');
    });

    expect(textarea.value).toBe('');
  });
});
