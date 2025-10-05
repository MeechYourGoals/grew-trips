import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createSecureResponse, createErrorResponse, createOptionsResponse } from "../_shared/securityHeaders.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createOptionsResponse();
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openaiApiKey) {
      return createErrorResponse('OpenAI API key not configured', 500);
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('No authorization header', 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { query, tripId, chatHistory = [] } = await req.json();

    if (!query || !tripId) {
      return new Response(
        JSON.stringify({ error: 'Query and tripId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is member of trip
    const { data: membership } = await supabase
      .from('trip_members')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return new Response(
        JSON.stringify({ error: 'Not a member of this trip' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embedding for the query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Search for relevant context
    const { data: searchResults, error: searchError } = await supabase.rpc('match_kb_chunks', {
      query_embedding: queryEmbedding,
      match_count: 8,
      filter_trip: tripId
    });

    if (searchError) {
      console.error('Search error:', searchError);
      return new Response(
        JSON.stringify({ error: 'Search failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context from search results
    const context = (searchResults || []).map((result: any, index: number) => 
      `[${index + 1}] ${result.source.toUpperCase()}: ${result.content}`
    ).join('\n\n');

    // Prepare system prompt
    const systemPrompt = `You are Chravel's AI Concierge for this trip. You have access to trip-specific information including messages, polls, broadcasts, files, calendar events, links, and locations.

Context from this trip:
${context}

Instructions:
- Answer based only on the provided context from this specific trip
- Be helpful, concise, and actionable
- If you mention specific information, cite the source type (MESSAGE, POLL, BROADCAST, etc.)
- If you can't find relevant information in the context, say so clearly
- Suggest practical next steps when appropriate
- Use a friendly, travel-focused tone`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-6), // Include last 6 messages for context
      { role: 'user', content: query }
    ];

    // Get response from OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const openaiData = await openaiResponse.json();
    const answer = openaiData.choices[0].message.content;

    // Log the query
    await supabase.from('ai_queries').insert({
      trip_id: tripId,
      user_id: user.id,
      query_text: query,
      response_text: answer,
      source_count: searchResults?.length || 0
    });

    // Format citations
    const citations = (searchResults || []).slice(0, 5).map((result: any) => ({
      doc_id: result.doc_id,
      source: result.source,
      source_id: result.id,
      snippet: result.content.slice(0, 150) + (result.content.length > 150 ? '...' : '')
    }));

    return new Response(
      JSON.stringify({ 
        answer,
        citations,
        contextUsed: searchResults?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-answer function:', error);
    return createErrorResponse('Internal server error', 500);
  }
});