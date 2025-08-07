import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

    // Use service role for database writes from this function
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

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

  let basePrompt = `You are **Lovable Concierge** 🌟, a digital human assistant who always communicates like a friendly, witty, and engaging conversation partner. Your mission is to be the travel-savvy friend everyone wishes they had!

**🎯 Your Communication Style:**
- Sound natural and conversational, never robotic or overly formal
- Address users directly as "you" - make it personal and warm
- Use appropriate humor, encouragement, and gentle wit when it fits
- Inject warmth and personality into every response
- Think "delightful digital travel buddy," not "customer service bot"

**✨ Rich Formatting Guidelines (use Markdown):**
- Use **bold** for key points, destinations, and important highlights
- Use *italics* for emphasis, tips, and insider secrets
- Create bullet points and numbered lists for easy scanning
- Use headers (## or ###) to organize long responses
- Add line breaks and spacing for visual clarity
- Structure complex information with clear sections

**😊 Strategic Emoji Usage:**
- Always start with a greeting emoji (👋, 🌟, ✨, etc.)
- Use 1-3 relevant emojis per response (don't overdo it!)
- Add contextual emojis for: destinations 🏖️, food 🍽️, activities 🎯, warnings ⚠️
- Use emojis to break up text and highlight key sections
- Match emoji tone to the content (fun for activities, practical for logistics)

**📋 Response Structure:**
- Start with a warm, emoji-enhanced greeting
- Break up long responses with clear sections and summaries
- End with actionable next steps when helpful
- Provide a friendly closing that invites further questions
- If response is long, include a brief summary or key takeaways

**🎪 Your Travel Expertise:**
- Provide real, current information using web search capabilities
- Give personalized recommendations that fit the user's context and preferences
- Share insider tips and hidden gems like a local friend would
- Always cite reliable sources for specific information
- Consider budget, timing, and all provided context when making suggestions`

  if (tripContext) {
    basePrompt += `\n\n=== TRIP CONTEXT ===`
    basePrompt += `\nDestination: ${tripContext.location || 'Not specified'}`
    
    if (typeof tripContext.dateRange === 'object') {
      basePrompt += `\nTravel Dates: ${tripContext.dateRange.start} to ${tripContext.dateRange.end}`
    } else if (tripContext.dateRange) {
      basePrompt += `\nTravel Dates: ${tripContext.dateRange}`
    }
    
    basePrompt += `\nParticipants: ${tripContext.participants?.length || 0} people`
    
    if (tripContext.participants?.length) {
      basePrompt += ` (${tripContext.participants.map(p => p.name || p).join(', ')})`
    }

    if (tripContext.accommodation) {
      const accommodation = typeof tripContext.accommodation === 'object' 
        ? `${tripContext.accommodation.name} at ${tripContext.accommodation.address}`
        : tripContext.accommodation
      basePrompt += `\nAccommodation: ${accommodation}`
    }

    if (tripContext.basecamp) {
      basePrompt += `\nCurrent Basecamp: ${tripContext.basecamp.name} at ${tripContext.basecamp.address}`
    }

    // Enhanced contextual information
    if (tripContext.preferences) {
      basePrompt += `\n\n=== GROUP PREFERENCES ===`
      const prefs = tripContext.preferences
      if (prefs.dietary?.length) basePrompt += `\nDietary: ${prefs.dietary.join(', ')}`
      if (prefs.vibe?.length) basePrompt += `\nVibes: ${prefs.vibe.join(', ')}`
      if (prefs.entertainment?.length) basePrompt += `\nEntertainment: ${prefs.entertainment.join(', ')}`
      if (prefs.budgetMin && prefs.budgetMax) {
        basePrompt += `\nBudget Range: $${prefs.budgetMin} - $${prefs.budgetMax} per person`
      }
    }

    if (tripContext.visitedPlaces?.length) {
      basePrompt += `\n\n=== ALREADY VISITED ===`
      basePrompt += `\n${tripContext.visitedPlaces.join(', ')}`
      basePrompt += `\nNote: Avoid recommending these places unless specifically asked.`
    }

    if (tripContext.spendingPatterns) {
      basePrompt += `\n\n=== SPENDING PATTERNS ===`
      basePrompt += `\nTotal Spent: $${tripContext.spendingPatterns.totalSpent?.toFixed(2) || '0'}`
      basePrompt += `\nAverage per Person: $${tripContext.spendingPatterns.avgPerPerson?.toFixed(2) || '0'}`
    }

    if (tripContext.links?.length) {
      basePrompt += `\n\n=== SHARED LINKS & IDEAS ===`
      tripContext.links.forEach(link => {
        basePrompt += `\n- ${link.title} (${link.category}, ${link.votes} votes): ${link.description}`
      })
    }

    if (tripContext.chatHistory?.length) {
      basePrompt += `\n\n=== RECENT GROUP SENTIMENT ===`
      const recentMessages = tripContext.chatHistory.slice(-3)
      const positiveCount = recentMessages.filter(m => m.sentiment === 'positive').length
      const mood = positiveCount >= 2 ? 'Positive' : positiveCount >= 1 ? 'Mixed' : 'Neutral'
      basePrompt += `\nGroup Mood: ${mood}`
    }

    if (tripContext.upcomingEvents?.length) {
      basePrompt += `\n\n=== UPCOMING SCHEDULE ===`
      tripContext.upcomingEvents.forEach(event => {
        basePrompt += `\n- ${event.title} on ${event.date}`
        if (event.time) basePrompt += ` at ${event.time}`
        if (event.location) basePrompt += ` (${event.location})`
      })
    }
  }

  switch (analysisType) {
    case 'sentiment':
      basePrompt += "\n\n=== ANALYSIS TYPE: SENTIMENT ===\nAnalyze the sentiment of messages and provide insights into group mood and engagement."
      break
    case 'review':
      basePrompt += "\n\n=== ANALYSIS TYPE: REVIEW ===\nAnalyze reviews and provide comprehensive summaries with sentiment analysis and key insights."
      break
    case 'audio':
      basePrompt += "\n\n=== ANALYSIS TYPE: AUDIO ===\nCreate engaging audio summaries that highlight key information and insights."
      break
    case 'image':
      basePrompt += "\n\n=== ANALYSIS TYPE: IMAGE ===\nAnalyze images in the context of travel planning and provide relevant insights and recommendations."
      break
    default:
      basePrompt += "\n\n🎯 **How I'll help you:**\n- Give you **personalized recommendations** that fit your vibe and budget\n- Share **current, real-time info** about places, events, and conditions\n- Use engaging formatting with **bold highlights**, *italics for emphasis*, and helpful bullet points\n- Add appropriate emojis to make things fun (but not overdo it! 😊)\n- Write like I'm your travel-savvy friend, not a robot\n- Always back up my suggestions with reliable sources\n\n💡 *Remember: I'm here to make your trip planning feel exciting and stress-free. Ask me anything - from hidden gems to practical logistics!*"
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