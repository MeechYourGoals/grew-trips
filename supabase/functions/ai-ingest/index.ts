import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface IngestRequest {
  source: 'message' | 'poll' | 'broadcast' | 'file' | 'calendar' | 'link';
  sourceId: string;
  tripId: string;
  content?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { source, sourceId, tripId, content }: IngestRequest = await req.json();

    if (!source || !sourceId || !tripId) {
      return new Response(
        JSON.stringify({ error: 'Source, sourceId, and tripId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let textContent = content || '';

    // If content not provided, fetch from source table
    if (!textContent) {
      switch (source) {
        case 'message':
          const { data: message } = await supabase
            .from('trip_chat_messages')
            .select('content, author_name')
            .eq('id', sourceId)
            .single();
          if (message) {
            textContent = `${message.author_name}: ${message.content}`;
          }
          break;

        case 'poll':
          const { data: poll } = await supabase
            .from('trip_polls')
            .select('question, options, total_votes')
            .eq('id', sourceId)
            .single();
          if (poll) {
            const options = Array.isArray(poll.options) ? poll.options.map((opt: any) => opt.text || opt).join(', ') : '';
            textContent = `POLL: ${poll.question}\nOptions: ${options}\nTotal votes: ${poll.total_votes}`;
          }
          break;

        case 'broadcast':
          // Note: broadcasts table doesn't exist yet, this is placeholder
          textContent = `Broadcast content for ${sourceId}`;
          break;

        case 'file':
          const { data: file } = await supabase
            .from('trip_files')
            .select('name, content_text, ai_summary')
            .eq('id', sourceId)
            .single();
          if (file) {
            textContent = `FILE: ${file.name}\n${file.ai_summary || file.content_text || 'No content available'}`;
          }
          break;

        case 'link':
          const { data: link } = await supabase
            .from('trip_links')
            .select('title, description, url')
            .eq('id', sourceId)
            .single();
          if (link) {
            textContent = `LINK: ${link.title}\n${link.description || ''}\nURL: ${link.url}`;
          }
          break;

        default:
          textContent = `Content from ${source}: ${sourceId}`;
      }
    }

    if (!textContent.trim()) {
      return new Response(
        JSON.stringify({ error: 'No content to ingest' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embedding
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: textContent.slice(0, 8000), // Limit input length
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Create or update knowledge base document
    const { data: doc, error: docError } = await supabase
      .from('kb_documents')
      .upsert({
        trip_id: tripId,
        source: source,
        source_id: sourceId,
        modality: 'text',
        plain_text: textContent,
        metadata: { source, sourceId, ingested_at: new Date().toISOString() },
        chunk_count: 1
      }, {
        onConflict: 'source,source_id,trip_id'
      })
      .select()
      .single();

    if (docError) {
      console.error('Error creating document:', docError);
      return new Response(
        JSON.stringify({ error: 'Failed to create document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete existing chunks for this document
    await supabase
      .from('kb_chunks')
      .delete()
      .eq('doc_id', doc.id);

    // Create new chunk with embedding
    const { error: chunkError } = await supabase
      .from('kb_chunks')
      .insert({
        doc_id: doc.id,
        chunk_index: 0,
        content: textContent,
        embedding: embedding,
        modality: 'text'
      });

    if (chunkError) {
      console.error('Error creating chunk:', chunkError);
      return new Response(
        JSON.stringify({ error: 'Failed to create chunk' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        docId: doc.id,
        contentLength: textContent.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-ingest function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});