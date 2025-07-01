export interface OpenAIOptions {
  tone?: 'friendly' | 'professional' | 'funny';
  maxTokens?: number;
}

export class OpenAIService {
  private static apiUrl = 'https://api.openai.com/v1/chat/completions';

  static async queryOpenAI(prompt: string, options: OpenAIOptions = {}): Promise<string> {
    const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY as string | undefined;
    if (!apiKey) {
      console.warn('OpenAI API key not configured');
      return 'OpenAI API key missing';
    }

    const messages = [] as Array<{ role: 'system' | 'user'; content: string }>;
    if (options.tone) {
      messages.push({ role: 'system', content: `Respond in a ${options.tone} tone.` });
    }
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: options.maxTokens ?? 256,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI error ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  static async classifyPriority(text: string): Promise<'urgent' | 'reminder' | 'fyi'> {
    const prompt = `Classify the priority of this message into one of: urgent, reminder, fyi.\nMessage: "${text}"\nPriority:`;
    try {
      const resp = await this.queryOpenAI(prompt, { maxTokens: 10 });
      const l = resp.toLowerCase();
      if (l.includes('urgent')) return 'urgent';
      if (l.includes('reminder')) return 'reminder';
      return 'fyi';
    } catch (e) {
      console.error('Priority classification failed', e);
      return 'fyi';
    }
  }
}
