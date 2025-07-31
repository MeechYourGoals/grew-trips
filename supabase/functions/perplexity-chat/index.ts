import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>
}

interface PerplexityRequest {
  message: string
  tripContext?: any
  chatHistory?: ChatMessage[]
  config?: {
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
  imageBase64?: string
  analysisType?: 'chat' | 'sentiment' | 'review' | 'audio' | 'image'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured')
    }

    const { 
      message, 
      tripContext, 
      chatHistory = [], 
      config = {}, 
      imageBase64,
      analysisType = 'chat'
    }: PerplexityRequest = await req.json()

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(tripContext, analysisType, config.systemPrompt)
    
    // Prepare messages for Perplexity
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
    ]

    // Add current message with optional image
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      })
    } else {
      messages.push({ role: 'user', content: message })
    }

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'sonar',
        messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
        stream: false
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Perplexity API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Perplexity API')
    }
    
    const aiResponse = data.choices[0].message.content
    const usage = data.usage
    const citations = data.citations || []

    // Store conversation in database for context awareness
    if (tripContext?.id) {
      await storeConversation(supabase, tripContext.id, message, aiResponse, analysisType)
    }

    // Add sentiment analysis for chat messages
    let sentimentScore = null
    if (analysisType === 'chat' || analysisType === 'sentiment') {
      sentimentScore = await analyzeSentiment(message, aiResponse)
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        usage,
        sentimentScore,
        citations,
        sources: citations,
        success: true,
        model: config.model || 'sonar'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Perplexity chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function buildSystemPrompt(tripContext: any, analysisType: string, customPrompt?: string): string {
  if (customPrompt) return customPrompt

  let basePrompt = "You are Concierge, an intelligent travel assistant with access to real-time web information. Provide helpful, specific recommendations and current information about destinations, activities, and travel planning."

  if (tripContext) {
    basePrompt += `\n\nTrip Context:
- Destination: ${tripContext.location || 'Not specified'}
- Dates: ${tripContext.dateRange || 'TBD'}
- Participants: ${tripContext.participants?.length || 0} people
- Budget: Not specified`

    if (tripContext.accommodation) {
      basePrompt += `\n- Accommodation: ${tripContext.accommodation}`
    }
  }

  switch (analysisType) {
    case 'sentiment':
      basePrompt += "\n\nAnalyze the sentiment of messages and provide insights into group mood and engagement."
      break
    case 'review':
      basePrompt += "\n\nAnalyze reviews and provide comprehensive summaries with sentiment analysis and key insights."
      break
    case 'audio':
      basePrompt += "\n\nCreate engaging audio summaries that highlight key information and insights."
      break
    case 'image':
      basePrompt += "\n\nAnalyze images in the context of travel planning and provide relevant insights and recommendations."
      break
    default:
      basePrompt += "\n\nProvide helpful, specific recommendations with current information. Use web search to find the most up-to-date details about restaurants, attractions, events, and travel conditions. Always cite your sources when providing specific information."
  }

  return basePrompt
}

async function storeConversation(supabase: any, tripId: string, userMessage: string, aiResponse: string, type: string) {
  try {
    await supabase
      .from('ai_conversations')
      .insert({
        trip_id: tripId,
        user_message: userMessage,
        ai_response: aiResponse,
        conversation_type: type,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to store conversation:', error)
  }
}

async function analyzeSentiment(userMessage: string, aiResponse: string): Promise<number> {
  // Simple sentiment analysis - can be enhanced with more sophisticated methods
  const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'happy', 'excited']
  const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'disappointing', 'frustrated', 'angry', 'sad', 'worried']
  
  const text = userMessage.toLowerCase()
  const positiveCount = positiveWords.filter(word => text.includes(word)).length
  const negativeCount = negativeWords.filter(word => text.includes(word)).length
  
  // Return score between -1 (negative) and 1 (positive)
  const totalWords = positiveCount + negativeCount
  if (totalWords === 0) return 0
  
  return (positiveCount - negativeCount) / totalWords
}