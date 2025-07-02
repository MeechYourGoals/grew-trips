import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenAIService } from '../../services/OpenAIService';

const originalEnv = { ...(import.meta as any).env };

describe('OpenAIService.classifyPriority', () => {
  beforeEach(() => {
    (import.meta as any).env = { ...originalEnv, VITE_OPENAI_API_KEY: 'test' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (import.meta as any).env = originalEnv;
  });

  it.each([
    ['urgent', 'This is urgent!'],
    ['reminder', 'Just a reminder for tomorrow'],
    ['fyi', 'FYI about something']
  ])('returns %s when model responds with %s', async (expected, response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: response } }] })
    } as any));

    const result = await OpenAIService.classifyPriority('text');
    expect(result).toBe(expected);
  });
});
