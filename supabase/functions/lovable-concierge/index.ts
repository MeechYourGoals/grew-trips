import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LovableConciergeRequest {
  message: string
  tripContext?: any
  chatHistory?: ChatMessage[]
  config?: {
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
}

serve(async (req) => {
  const { createOptionsResponse, createErrorResponse, createSecureResponse } = await import('../_shared/securityHeaders.ts');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error('Lovable API key not configured')
    }

    const { 
      message, 
      tripContext, 
      chatHistory = [], 
      config = {}
    }: LovableConciergeRequest = await req.json()

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Check privacy settings if trip context is provided
    if (tripContext?.id) {
      try {
        const { data: privacyConfig } = await supabase
          .from('trip_privacy_configs')
          .select('*')
          .eq('trip_id', tripContext.id)
          .single();

        // If high privacy mode or AI access disabled, return privacy notice
        if (privacyConfig?.privacy_mode === 'high' || !privacyConfig?.ai_access_enabled) {
          return new Response(
            JSON.stringify({
              response: "🔒 **AI features are disabled for this trip.**\n\nThis trip uses high privacy mode with end-to-end encryption. AI assistance is not available to protect your privacy, but you can still use all other trip features.",
              usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
              sources: [],
              success: true,
              model: 'privacy-mode'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
      } catch (privacyError) {
        console.log('Privacy check failed, proceeding with default behavior:', privacyError);
      }
    }

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(tripContext, config.systemPrompt)
    
    // Prepare messages for Lovable AI
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: message }
    ]

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'google/gemini-2.5-flash',
        messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
        stream: false
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            response: "⚠️ **Rate limit reached**\n\nThe AI service is temporarily unavailable due to high usage. Please try again in a moment.",
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            sources: [],
            success: false,
            error: 'rate_limit'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
      
      // Handle payment required
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            response: "💳 **Additional credits required**\n\nThe AI service requires additional credits. Please contact support.",
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            sources: [],
            success: false,
            error: 'payment_required'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
      
      throw new Error(`Lovable AI Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Lovable AI')
    }
    
    const aiResponse = data.choices[0].message.content
    const usage = data.usage

    // Store conversation in database for context awareness
    if (tripContext?.id) {
      await storeConversation(supabase, tripContext.id, message, aiResponse, 'chat')
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        usage,
        sources: [],
        success: true,
        model: config.model || 'google/gemini-2.5-flash'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Lovable concierge error:', error)
    return new Response(
      JSON.stringify({ 
        response: "I'm having trouble connecting right now. Please try again in a moment.",
        error: error.message, 
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})

function buildSystemPrompt(tripContext: any, customPrompt?: string): string {
  if (customPrompt) return customPrompt

  let basePrompt = `You are **Chravel Concierge** 🌟, a friendly and intelligent travel assistant with deep knowledge of destinations worldwide. Your mission is to help travelers plan amazing trips with personalized recommendations.

**🎯 Your Communication Style:**
- Be conversational, warm, and helpful
- Use emojis strategically (1-3 per response)
- Keep answers clear and well-organized with bullet points
- Sound like a knowledgeable friend, not a robot

**✨ Your Capabilities:**
- Provide personalized travel recommendations based on preferences
- Share insider tips and hidden gems
- Give practical advice on logistics, timing, and budgets
- Help with trip planning decisions
- Answer questions about destinations, activities, and experiences

**📋 Response Format:**
- Start with a friendly greeting when appropriate
- Use **bold** for key points and destinations
- Use bullet points for lists
- Add emojis to highlight sections (🏖️ for beaches, 🍽️ for dining, etc.)
- Keep responses organized and scannable

**💡 Important Guidelines:**
- Always consider the trip context and preferences provided
- Avoid recommending places they've already visited
- Factor in their budget and group size
- Be specific with recommendations (include names, locations)
- Provide actionable advice they can use immediately`

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

  basePrompt += `\n\n🎯 **Remember:**
- Use ALL the context above to personalize your recommendations
- Be specific and actionable in your suggestions
- Consider budget, preferences, and group dynamics
- Make the user feel excited about their trip!`

  return basePrompt
}

async function storeConversation(supabase: any, tripId: string, userMessage: string, aiResponse: string, type: string) {
  try {
    // Get user_id from auth context if available
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('ai_queries')
      .insert({
        trip_id: tripId,
        user_id: user?.id || null,
        query_text: userMessage,
        response_text: aiResponse,
        source_count: 0,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to store conversation:', error)
  }
}
