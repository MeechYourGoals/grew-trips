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
 * @description Supabase edge function for handling trip photo uploads.
 * It validates that the file is an image, uploads it to the `trip-photos` storage bucket,
 * and saves the photo's metadata (including a caption) to the `trip_photos` table.
 *
 * @param {Request} req - The incoming request object, expected to be multipart/form-data.
 * @param {FormData} req.formData - The form data containing the photo and metadata.
 * @param {File} req.formData.file - The photo file to upload.
 * @param {string} req.formData.tripId - The ID of the trip the photo belongs to.
 * @param {string} req.formData.userId - The ID of the user uploading the photo.
 * @param {string} [req.formData.caption] - An optional caption for the photo.
 *
 * @returns {Response} A response object with the database record for the photo and its public URL.
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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const tripId = formData.get('tripId') as string;
    const userId = formData.get('userId') as string;
    const caption = formData.get('caption') as string || '';

    if (!file || !tripId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'File must be an image' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (10MB max for photos)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Image size too large (max 10MB)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const photoPath = `${tripId}/photos/${fileName}`;

    // Upload original photo to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trip-photos')
      .upload(photoPath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload photo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save photo metadata to database
    const { data: photoRecord, error: dbError } = await supabase
      .from('trip_photos')
      .insert({
        trip_id: tripId,
        photo_path: uploadData.path,
        uploaded_by: userId,
        caption: caption,
        metadata: {
          original_name: file.name,
          file_size: file.size,
          content_type: file.type,
          upload_timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save photo metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL for the photo
    const { data: { publicUrl } } = supabase.storage
      .from('trip-photos')
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({ 
        success: true, 
        photo: photoRecord,
        publicUrl: publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in photo-upload function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});