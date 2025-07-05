import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { fileId, fileUrl, extractionType } = await req.json();

    if (!fileId || !fileUrl || !extractionType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let extractedData;
    let confidenceScore = 0.8;

    switch (extractionType) {
      case 'calendar':
        extractedData = await extractCalendarEvents(fileUrl);
        break;
      case 'text':
        extractedData = await extractText(fileUrl);
        break;
      case 'itinerary':
        extractedData = await extractItinerary(fileUrl);
        break;
      default:
        extractedData = await extractGeneral(fileUrl);
    }

    // Save extraction results to database
    const { data: extractionRecord, error: dbError } = await supabase
      .from('file_ai_extractions')
      .insert({
        file_id: fileId,
        extracted_data: extractedData,
        extraction_type: extractionType,
        confidence_score: confidenceScore
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save extraction results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extraction: extractionRecord,
        extracted_data: extractedData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in file-ai-parser function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractCalendarEvents(fileUrl: string) {
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze this document and extract any calendar events, dates, times, or schedule information. Return the data in JSON format:
              {
                "events": [
                  {
                    "title": "string",
                    "date": "YYYY-MM-DD",
                    "start_time": "HH:MM",
                    "end_time": "HH:MM",
                    "location": "string",
                    "description": "string"
                  }
                ],
                "dates_mentioned": ["YYYY-MM-DD"],
                "locations_mentioned": ["string"]
              }`
            },
            {
              type: 'image_url',
              image_url: { url: fileUrl }
            }
          ]
        }
      ],
      max_tokens: 1500
    })
  });

  const result = await openAIResponse.json();
  return JSON.parse(result.choices[0].message.content);
}

async function extractText(fileUrl: string) {
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract all text content from this document and return it in a clean, structured format.'
            },
            {
              type: 'image_url',
              image_url: { url: fileUrl }
            }
          ]
        }
      ],
      max_tokens: 2000
    })
  });

  const result = await openAIResponse.json();
  return { text: result.choices[0].message.content };
}

async function extractItinerary(fileUrl: string) {
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this itinerary document and extract structured travel information in JSON format:
              {
                "title": "string",
                "destination": "string",
                "dates": {
                  "start": "YYYY-MM-DD",
                  "end": "YYYY-MM-DD"
                },
                "flights": [
                  {
                    "date": "YYYY-MM-DD",
                    "time": "HH:MM",
                    "from": "string",
                    "to": "string",
                    "flight_number": "string"
                  }
                ],
                "hotels": [
                  {
                    "name": "string",
                    "address": "string",
                    "check_in": "YYYY-MM-DD",
                    "check_out": "YYYY-MM-DD"
                  }
                ],
                "activities": [
                  {
                    "date": "YYYY-MM-DD",
                    "time": "HH:MM",
                    "title": "string",
                    "location": "string",
                    "description": "string"
                  }
                ]
              }`
            },
            {
              type: 'image_url',
              image_url: { url: fileUrl }
            }
          ]
        }
      ],
      max_tokens: 2000
    })
  });

  const result = await openAIResponse.json();
  return JSON.parse(result.choices[0].message.content);
}

async function extractGeneral(fileUrl: string) {
  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this document and extract key information including any dates, locations, prices, contact information, or important details that might be relevant for trip planning.'
            },
            {
              type: 'image_url',
              image_url: { url: fileUrl }
            }
          ]
        }
      ],
      max_tokens: 1500
    })
  });

  const result = await openAIResponse.json();
  return { content: result.choices[0].message.content };
}