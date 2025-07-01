export interface OpenAIReviewResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platforms: string[];
}

export interface OpenAIAudioResult {
  summary: string;
  audioUrl: string;
  duration: number;
  fileKey?: string;
}

export class OpenAIService {
  private static readonly REVIEW_ENDPOINT = '/api/ai-features';
  private static readonly AUDIO_ENDPOINT = '/api/generate-audio-summary';

  static async analyzeReviews(url: string): Promise<OpenAIReviewResult> {
    const res = await fetch(this.REVIEW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: 'reviews', url })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Review analysis failed');
    }

    const data = await res.json();
    return data;
  }

  static async generateAudioSummary(url: string, userId: string, tripId?: string): Promise<OpenAIAudioResult> {
    const res = await fetch(this.AUDIO_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, user_id: userId, trip_id: tripId })
    });

    if (!res.ok) {
      let message: string;
      try {
        const err = await res.json();
        message = err.error || err.message;
      } catch {
        message = await res.text();
      }
      throw new Error(message || 'Audio summary failed');
    }

    const data = await res.json();
    return {
      summary: data.summary,
      audioUrl: data.audioUrl,
      duration: data.duration,
      fileKey: data.fileKey
    };
  }
}
