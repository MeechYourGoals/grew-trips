import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

/**
 * @description CORS headers for cross-origin requests.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @description A Supabase edge function that uses OpenAI's `gpt-4o` vision model to parse
 * an image of a receipt and extract structured data from it. The extracted data is then
 * saved to the `trip_receipts` table.
 *
 * @param {Request} req - The incoming request object.
 * @param {object} req.body - The JSON body of the request.
 * @param {string} req.body.receiptImageUrl - The URL of the receipt image to parse.
 * @param {string} req.body.tripId - The ID of the trip the receipt belongs to.
 * @param {string} req.body.userId - The ID of the user who uploaded the receipt.
 *
 * @returns {Response} A response object with the created receipt record and the full parsed data.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { receiptImageUrl, tripId, userId } = await req.json();

    if (!receiptImageUrl || !tripId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use OpenAI Vision API to parse receipt
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
                text: `Please analyze this receipt image and extract the following information in JSON format:
                {
                  "total_amount": number,
                  "currency": "USD",
                  "date": "YYYY-MM-DD",
                  "merchant_name": "string",
                  "items": [{"name": "string", "price": number, "quantity": number}],
                  "tax": number,
                  "tip": number
                }
                
                If any field is not clearly visible, use null for that field.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: receiptImageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${await openAIResponse.text()}`);
    }

    const openAIResult = await openAIResponse.json();
    const parsedContent = openAIResult.choices[0].message.content;
    
    let parsedData;
    try {
      parsedData = JSON.parse(parsedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parsedContent);
      parsedData = { error: 'Failed to parse receipt', raw_response: parsedContent };
    }

    // Save receipt to database
    const { data: receiptRecord, error: dbError } = await supabase
      .from('trip_receipts')
      .insert({
        trip_id: tripId,
        receipt_url: receiptImageUrl,
        amount: parsedData.total_amount || null,
        user_id: userId,
        description: parsedData.merchant_name || null
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save receipt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        receipt: receiptRecord,
        parsed_data: parsedData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in receipt-parser function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});