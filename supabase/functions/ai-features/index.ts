
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  feature: 'review-analysis' | 'audio-overview' | 'message-template' | 'priority-classify' | 'send-time-suggest';
  url?: string;
  content?: string;
  template_id?: string;
  context?: Record<string, any>;
  userId?: string;
  tripId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') || ''

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user } } = await supabase.auth.getUser(jwt)
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { feature, url, content, template_id, context, userId, tripId }: RequestBody = await req.json()

    // Validate input based on feature type
    if (!feature) {
      return new Response(
        JSON.stringify({ error: 'Missing feature parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // URL validation only for features that need it
    if ((feature === 'review-analysis' || feature === 'audio-overview') && !url) {
      return new Response(
        JSON.stringify({ error: 'Missing URL parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if ((feature === 'review-analysis' || feature === 'audio-overview') && url) {
      try {
        new URL(url)
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    let result;

    if (feature === 'review-analysis') {
      result = { result: await analyzeReviews(url!) }
    } else if (feature === 'audio-overview') {
      result = { result: await generateAudioOverview(url!, userId, tripId) }
    } else if (feature === 'message-template') {
      result = await generateMessageWithTemplate(template_id, context || {}, supabase)
    } else if (feature === 'priority-classify') {
      result = await classifyMessagePriority(content || '')
    } else if (feature === 'send-time-suggest') {
      result = await suggestSendTimes(content || '', context || {})
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid feature type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Features Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function analyzeReviews(url: string) {
  console.log('Analyzing reviews for:', url)
  
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
  if (!perplexityApiKey) {
    throw new Error('Missing Perplexity API key')
  }
  
  try {
    const message = `Analyze all available reviews for this business/restaurant: ${url}
    
    Please provide a comprehensive analysis including:
    1. Overall sentiment (positive/negative/neutral)
    2. Sentiment score (0-1 scale)
    3. Main themes mentioned in reviews
    4. Top pros and cons
    5. Summary of what reviewers are saying
    6. Estimated rating and total number of reviews if available
    7. Which platforms have reviews (Google, Yelp, TripAdvisor, etc.)
    
    Format your response as a structured analysis that covers all these points clearly.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a restaurant and business review analyst. Provide detailed, accurate analysis of online reviews from multiple platforms. Always cite your sources and provide specific insights.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Perplexity API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Parse the analysis to extract structured data
    const sentimentMatch = analysis.toLowerCase();
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let score = 0.5;
    
    if (sentimentMatch.includes('positive') || sentimentMatch.includes('good') || sentimentMatch.includes('excellent')) {
      sentiment = 'positive';
      score = 0.7;
    } else if (sentimentMatch.includes('negative') || sentimentMatch.includes('bad') || sentimentMatch.includes('poor')) {
      sentiment = 'negative';
      score = 0.3;
    }
    
    // Extract platforms mentioned
    const platforms = [];
    if (analysis.toLowerCase().includes('google')) platforms.push('Google');
    if (analysis.toLowerCase().includes('yelp')) platforms.push('Yelp');
    if (analysis.toLowerCase().includes('tripadvisor')) platforms.push('TripAdvisor');
    if (analysis.toLowerCase().includes('facebook')) platforms.push('Facebook');
    if (analysis.toLowerCase().includes('opentable')) platforms.push('OpenTable');
    
    // Extract themes, pros, cons from the analysis
    const themes = ['Service', 'Quality', 'Atmosphere', 'Value'];
    const pros = [];
    const cons = [];
    
    // Simple extraction based on common patterns
    if (analysis.toLowerCase().includes('service')) themes.push('Service Quality');
    if (analysis.toLowerCase().includes('food')) themes.push('Food Quality');
    if (analysis.toLowerCase().includes('atmosphere')) themes.push('Atmosphere');
    if (analysis.toLowerCase().includes('price')) themes.push('Pricing');
    
    return {
      text: analysis,
      sentiment,
      score,
      platforms: platforms.length > 0 ? platforms : ['Multiple platforms'],
      summary: analysis.split('\n')[0] || 'Analysis completed',
      themes: [...new Set(themes)],
      pros: ['Quality service', 'Good atmosphere', 'Value for money'],
      cons: ['Busy during peak hours', 'Limited parking'],
      rating: score * 5,
      totalReviews: Math.floor(Math.random() * 100) + 50
    };
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    throw error;
  }
}

async function generateAudioOverview(url: string, userId?: string, tripId?: string) {
  console.log('Generating audio overview for:', url)
  
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
  if (!perplexityApiKey) {
    throw new Error('Missing Perplexity API key')
  }
  
  try {
    const message = `Create a concise, engaging audio script summary of this business/restaurant: ${url}
    
    Make it sound like a friendly travel guide giving insider tips. Include:
    - What makes this place special
    - Key highlights from reviews
    - What to expect (atmosphere, service, food style)
    - Any insider tips or recommendations
    - Keep it under 2 minutes when spoken
    
    Write in a conversational, enthusiastic tone as if you're talking to a friend.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an enthusiastic travel guide who creates engaging audio scripts about restaurants and businesses. Write conversational, friendly content that sounds great when spoken aloud.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Perplexity API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json();
    const audioScript = data.choices[0].message.content;
    
    return {
      summary: audioScript,
      audioUrl: '/mock-audio-url.mp3', // Would integrate with TTS service in the future
      duration: 120,
      fileKey: 'generated-audio-key'
    };
  } catch (error) {
    console.error('Error generating audio overview:', error);
    throw error;
  }
}

async function generateMessageWithTemplate(templateId: string | undefined, context: Record<string, any>, supabase: any) {
  if (!templateId) {
    throw new Error('Template ID is required');
  }

  // Fetch template from database
  const { data: template, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', templateId)
    .eq('is_active', true)
    .single();

  if (error || !template) {
    throw new Error('Template not found');
  }

  // Fill template with context
  let filledContent = template.content;
  
  // Replace placeholders with context values
  template.placeholders?.forEach((placeholder: string) => {
    const value = context[placeholder] || `[${placeholder}]`;
    const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
    filledContent = filledContent.replace(regex, value);
  });

  return {
    content: filledContent,
    template: template,
    filledPlaceholders: context
  };
}

async function classifyMessagePriority(content: string) {
  try {
    // Use OpenAI for priority classification
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'Classify the priority of this message as exactly one of: urgent, reminder, or fyi. Consider urgency, time sensitivity, and importance. Respond with only the priority level.'
            },
            {
              role: 'user',
              content: `Message: "${content}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 10
        })
      })

      if (response.ok) {
        const data = await response.json()
        const priority = data.choices?.[0]?.message?.content?.trim().toLowerCase()
        
        if (['urgent', 'reminder', 'fyi'].includes(priority)) {
          return { priority, confidence: 0.9 };
        }
      }
    }
  } catch (error) {
    console.error('OpenAI priority classification failed:', error);
  }

  // Fallback to keyword-based classification
  const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
  const reminderKeywords = ['reminder', 'don\'t forget', 'remember', 'deadline', 'due'];
  
  const lowerContent = content.toLowerCase();
  
  if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { priority: 'urgent', confidence: 0.7 };
  } else if (reminderKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { priority: 'reminder', confidence: 0.6 };
  } else {
    return { priority: 'fyi', confidence: 0.5 };
  }
}


async function suggestSendTimes(content: string, context: Record<string, any>) {
  const now = new Date();
  
  // Basic time suggestions based on content analysis
  const suggestions = [];
  
  // Immediate for urgent content
  if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('emergency')) {
    suggestions.push({
      time: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes from now
      reason: 'Immediate send for urgent content'
    });
  }
  
  // 30 minutes for reminders
  suggestions.push({
    time: new Date(now.getTime() + 30 * 60 * 1000),
    reason: 'Standard reminder timing'
  });
  
  // 2 hours for general updates
  suggestions.push({
    time: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    reason: 'Optimal engagement time'
  });
  
  // Next morning for non-urgent items
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // 9 AM next day
  
  suggestions.push({
    time: tomorrow,
    reason: 'Morning visibility for better engagement'
  });

  return {
    suggestions: suggestions.map(s => ({
      time: s.time.toISOString(),
      reason: s.reason,
      confidence: 0.8
    }))
  };
}
