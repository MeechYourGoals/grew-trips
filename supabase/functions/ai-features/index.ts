
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  feature: 'reviews' | 'audio';
  url: string;
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
    const { feature, url }: RequestBody = await req.json()

    // Validate input
    if (!feature || !url) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Check user's subscription plan

    let result;

    if (feature === 'reviews') {
      result = await analyzeReviews(url)
    } else if (feature === 'audio') {
      result = await generateAudioOverview(url)
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
  // Mock implementation for now - replace with actual Perplexity API call
  console.log('Analyzing reviews for:', url)
  
  // TODO: Implement actual Perplexity API integration
  // const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
  // if (!perplexityApiKey) throw new Error('Missing Perplexity API key')
  
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
  
  return {
    text: "This restaurant consistently receives praise for its authentic flavors and excellent service. Customers particularly love the fresh ingredients and cozy atmosphere. Most reviews highlight the friendly staff and reasonable prices. A few mentions of longer wait times during peak hours, but overall sentiment is very positive with customers recommending it to friends and family.",
    sentiment: 'positive' as const,
    score: 87,
    platforms: ['Yelp', 'Google Reviews', 'TripAdvisor', 'Facebook']
  }
}

async function generateAudioOverview(url: string) {
  // Mock implementation for now - replace with actual Google Notebook LM integration
  console.log('Generating audio overview for:', url)
  
  // TODO: Implement actual Google Notebook LM integration
  // const notebookLmKey = Deno.env.get('GOOGLE_NOTEBOOK_LM_KEY')
  // if (!notebookLmKey) throw new Error('Missing Google Notebook LM API key')
  
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate API delay
  
  return {
    summary: "Welcome to this comprehensive overview. This establishment has been serving the community for over a decade, known for its commitment to quality and customer satisfaction. The venue offers a unique blend of traditional and modern approaches, creating an experience that appeals to a wide range of visitors. Staff members are highly trained and passionate about their craft, ensuring every interaction is memorable.",
    audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Mock audio URL
    duration: 147 // seconds
  }
}
