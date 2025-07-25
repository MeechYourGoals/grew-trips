
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  feature: 'reviews' | 'audio' | 'message-template' | 'priority-classify' | 'send-time-suggest';
  url?: string;
  content?: string;
  template_id?: string;
  context?: Record<string, any>;
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
    const { feature, url, content, template_id, context }: RequestBody = await req.json()

    // Validate input based on feature type
    if (!feature) {
      return new Response(
        JSON.stringify({ error: 'Missing feature parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // URL validation only for features that need it
    if ((feature === 'reviews' || feature === 'audio') && !url) {
      return new Response(
        JSON.stringify({ error: 'Missing URL parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if ((feature === 'reviews' || feature === 'audio') && url) {
      try {
        new URL(url)
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // TODO: Check user's subscription plan

    let result;

    if (feature === 'reviews') {
      result = await analyzeReviews(url!)
    } else if (feature === 'audio') {
      result = await generateAudioOverview(url!)
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
    // Use Vertex AI for priority classification
    const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT')
    const location = Deno.env.get('GOOGLE_CLOUD_LOCATION') || 'us-central1'
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')

    if (!projectId || !serviceAccountKey) {
      throw new Error('Google Cloud credentials not configured')
    }

    const credentials = JSON.parse(serviceAccountKey)
    const accessToken = await getVertexAIAccessToken(credentials)

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.0-flash-exp:generateContent`

    const prompt = `Classify the priority of this message as "urgent", "reminder", or "fyi". Consider urgency, time sensitivity, and importance. Respond with only the priority level.

Message: "${content}"`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10
        }
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const priority = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase()
      
      if (['urgent', 'reminder', 'fyi'].includes(priority)) {
        return { priority, confidence: 0.9 };
      }
    }
  } catch (error) {
    console.error('Vertex AI priority classification failed:', error);
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

async function getVertexAIAccessToken(credentials: any): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: await createJWT(header, claim, credentials.private_key)
    }).toString()
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to get access token')
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

async function createJWT(header: any, payload: any, privateKey: string): Promise<string> {
  const encoder = new TextEncoder()
  const headerBase64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadBase64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const data = `${headerBase64}.${payloadBase64}`
  
  const keyData = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))
  
  const cryptoKey = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(data))
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  return `${data}.${signatureBase64}`
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
