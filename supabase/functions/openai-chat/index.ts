import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

/**
 * @description The OpenAI API key, retrieved from environment variables.
 */
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

/**
 * @description Interface for a single message in a chat conversation, following OpenAI's format.
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>
}

/**
 * @description Interface for the request body of the `openai-chat` function.
 */
interface OpenAIRequest {
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

/**
 * @description A versatile Supabase edge function that acts as a configurable proxy to the OpenAI Chat Completions API.
 * It can handle text-based chat, image analysis (vision), and other specialized AI tasks. It builds a
 * context-aware system prompt, logs conversations, and can perform post-processing like sentiment analysis.
 *
 * @param {Request} req - The incoming request object.
 * @param {OpenAIRequest} req.body - The JSON body of the request, containing the message and configuration.
 *
 * @returns {Response} A response object with the AI's response, token usage, and other metadata.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const { 
      message, 
      tripContext, 
      chatHistory = [], 
      config = {}, 
      imageBase64,
      analysisType = 'chat'
    }: OpenAIRequest = await req.json()

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(tripContext, analysisType, config.systemPrompt)
    
    // Prepare messages for OpenAI
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

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4.1-2025-04-14',
        messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
        stream: false
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API')
    }
    
    const aiResponse = data.choices[0].message.content
    const usage = data.usage

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
        success: true,
        model: config.model || 'gpt-4.1-2025-04-14'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('OpenAI chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

/**
 * @description Builds a dynamic system prompt for the AI based on the trip context and analysis type.
 *
 * @param {any} tripContext - An object containing context about the current trip.
 * @param {string} analysisType - The type of analysis being performed, which influences the prompt.
 * @param {string} [customPrompt] - An optional custom prompt that will override the dynamic generation.
 * @returns {string} The generated system prompt.
 */
function buildSystemPrompt(tripContext: any, analysisType: string, customPrompt?: string): string {
  if (customPrompt) return customPrompt

  let basePrompt = "You are Concierge, an intelligent travel assistant with deep knowledge of destinations, activities, and travel planning."

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
      basePrompt += "\n\nProvide helpful, specific recommendations and assistance with trip planning. Be conversational and focus on practical advice."
  }

  return basePrompt
}

/**
 * @description Stores a user message and the corresponding AI response in the `ai_conversations` table.
 *
 * @param {any} supabase - The Supabase client instance.
 * @param {string} tripId - The ID of the trip the conversation belongs to.
 * @param {string} userMessage - The user's message.
 * @param {string} aiResponse - The AI's response.
 * @param {string} type - The type of conversation or analysis.
 */
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

/**
 * @description Performs a simple keyword-based sentiment analysis on a text.
 * This is a basic implementation and could be replaced with a more sophisticated NLP service.
 *
 * @param {string} userMessage - The user's message to analyze.
 * @param {string} aiResponse - The AI's response (currently unused in this simple version).
 * @returns {Promise<number>} A promise that resolves to a sentiment score between -1 (negative) and 1 (positive).
 */
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