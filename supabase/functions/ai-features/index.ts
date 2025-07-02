
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// Importing OpenAI library
import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define a more generic request body structure or use a type union for different actions
interface RequestPayload {
  action: 'generateMessage' | 'analyzeReviews' | 'generateAudioOverview' | 'classifyMessagePriority' | 'suggestSendTime'; // Added suggestSendTime
  payload: any; // Payload will vary based on action
}

// Initialize OpenAI client with API key from environment variables
let openai: OpenAI | null = null;
const openAIAPIKey = Deno.env.get("OPENAI_API_KEY");
if (openAIAPIKey) {
  openai = new OpenAI({ apiKey: openAIAPIKey });
} else {
  console.warn("OPENAI_API_KEY is not set. AI features requiring it will not work.");
}

// Supabase client for data fetching
// Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in env for this function
const supabaseAdminClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload }: RequestPayload = await req.json();

    let result;

    if (action === 'generateMessage') {
      if (!openai) return new Response(JSON.stringify({ error: 'OpenAI client not initialized for generateMessage.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (!payload || !payload.tone || !payload.tripId) { // Prompt is now optional if templateText is provided
        return new Response(JSON.stringify({ error: 'Missing tone or tripId for generateMessage' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (!payload.prompt && !payload.templateText) {
        return new Response(JSON.stringify({ error: 'Either prompt or templateText is required for generateMessage' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      result = await generateAiChatMessage(payload.prompt, payload.tone, payload.tripId, payload.templateText);
    } else if (action === 'analyzeReviews') {
      if (!payload || !payload.url) {
        return new Response(JSON.stringify({ error: 'Missing URL for analyzeReviews' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      result = await analyzeReviews(payload.url);
    } else if (action === 'generateAudioOverview') {
      if (!payload || !payload.url) {
        return new Response(JSON.stringify({ error: 'Missing URL for generateAudioOverview' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      result = await generateAudioOverview(payload.url);
    } else if (action === 'classifyMessagePriority') {
      if (!openai) return new Response(JSON.stringify({ error: 'OpenAI client not initialized. API key might be missing.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (!payload || !payload.messageContent) {
        return new Response(JSON.stringify({ error: 'Missing messageContent for classifyMessagePriority' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      result = await classifyMessagePriority(payload.messageContent, payload.tripContext); // tripContext is optional
    } else if (action === 'suggestSendTime') {
      if (!openai) return new Response(JSON.stringify({ error: 'OpenAI client not initialized for suggestSendTime.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (!payload || !payload.tripId || !payload.messagePurpose) {
        return new Response(JSON.stringify({ error: 'Missing tripId or messagePurpose for suggestSendTime' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      result = await suggestOptimalSendTime(payload.tripId, payload.messagePurpose, payload.currentMessageUrgency);
    }
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid action type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Features Error:', error);
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

async function fetchTripContext(tripId: string) {
  let contextParts = [];

  // Fetch Trip Name and Dates
  const { data: tripData, error: tripError } = await supabaseAdminClient
    .from('trips') // ASSUMPTION: table name is 'trips'
    .select('name, start_date, end_date')
    .eq('id', tripId)
    .single();

  if (tripError) console.error(`Error fetching trip details for ${tripId}:`, tripError.message);
  if (tripData) {
    contextParts.push(`Trip Name: ${tripData.name}`);
    if (tripData.start_date) contextParts.push(`Start Date: ${new Date(tripData.start_date).toLocaleDateString()}`);
    if (tripData.end_date) contextParts.push(`End Date: ${new Date(tripData.end_date).toLocaleDateString()}`);
  }

  // Fetch Upcoming Events (e.g., next 2-3 events or events in next 48 hours)
  // ASSUMPTION: table name 'trip_events', columns 'event_name', 'location', 'event_date', 'event_time'
  const now = new Date();
  const futureLimit = new Date(now.getTime() + 48 * 60 * 60 * 1000); // Next 48 hours

  const { data: eventsData, error: eventsError } = await supabaseAdminClient
    .from('trip_events')
    .select('event_name, location, event_date, event_time')
    .eq('trip_id', tripId)
    .gte('event_date', now.toISOString().split('T')[0]) // From today onwards
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true })
    .limit(5); // Limit to a few upcoming events

  if (eventsError) console.error(`Error fetching events for ${tripId}:`, eventsError.message);
  if (eventsData && eventsData.length > 0) {
    contextParts.push("\nUpcoming Events:");
    eventsData.forEach(event => {
      let eventString = `- ${event.event_name}`;
      if (event.location) eventString += ` at ${event.location}`;
      if (event.event_date) eventString += ` on ${new Date(event.event_date + 'T00:00:00Z').toLocaleDateString()}`; // Ensure date is treated as UTC
      if (event.event_time) eventString += ` at ${event.event_time}`;
      contextParts.push(eventString);
    });
  }

  // Fetch Participants (sample a few names)
  // ASSUMPTION: table 'trip_participants', join with 'users' or 'profiles' for names
  const { data: participantsData, error: participantsError } = await supabaseAdminClient
    .from('trip_participants')
    .select('users (id, raw_user_meta_data)') // Adjust if your user table/column is different
    .eq('trip_id', tripId)
    .limit(10); // Sample a few participants

  if (participantsError) console.error(`Error fetching participants for ${tripId}:`, participantsError.message);
  if (participantsData && participantsData.length > 0) {
    const names = participantsData.map(p => (p.users as any)?.raw_user_meta_data?.name || (p.users as any)?.id).filter(Boolean);
    if (names.length > 0) {
      contextParts.push(`\nParticipants include: ${names.slice(0, 5).join(', ')}${names.length > 5 ? ' and others.' : '.'}`);
    }
  }

  return contextParts.length > 0 ? `\n\nTrip Context for ID ${tripId}:\n${contextParts.join('\n')}` : "";
}


async function generateAiChatMessage(userPrompt: string = "", tone: string, tripId: string, templateText?: string) {
  if (!openai) throw new Error("OpenAI client not initialized.");

  console.log(`Generating AI message for trip ${tripId}. User prompt: "${userPrompt}", Tone: "${tone}", Template: ${templateText ? "Yes" : "No"}`);

  // Fetch dynamic trip context
  const tripContextInfo = await fetchTripContext(tripId);

  let systemMessage = "You are an AI assistant helping a trip organizer draft messages for their group. ";
  // Tone guidance
  switch (tone.toLowerCase()) {
    case "friendly ✅": case "friendly": systemMessage += "Adopt a friendly, warm, and approachable tone. Use emojis where appropriate. "; break;
    case "direct 📣": case "direct": systemMessage += "Adopt a direct, clear, and concise tone. Get straight to the point. "; break;
    case "informative ✍️": case "informative": systemMessage += "Adopt an informative, detailed, and helpful tone. Provide necessary context. "; break;
    case "professional": systemMessage += "Adopt a professional, formal, and polite tone. "; break;
    case "fun 🎉": case "fun": systemMessage += "Adopt a fun, lighthearted, and engaging tone. Use playful language and emojis. "; break;
    default: systemMessage += "Adopt a neutral tone. ";
  }

  if (templateText) {
    systemMessage += "\n\nA message template has been provided. Your main goal is to intelligently fill in any placeholders (like {{placeholderName}}, [Placeholder], etc.) in the template using the User's Goal and the provided Trip Context. If the template seems like a good fit for the user's goal, adapt it. If the user's goal is very different, you can deviate more but try to maintain the requested tone. Ensure the final message is coherent and complete.";
  } else {
    systemMessage += "\n\nGenerate a message based on the User's Goal and the provided Trip Context. Ensure the message is coherent and complete, and ready to be sent.";
  }
   systemMessage += "\nThe final message should be directly usable by the trip organizer.";


  let userQuery = "";
  if (templateText) {
    userQuery += `Template to use/adapt:\n"""\n${templateText}\n"""\n`;
  }
  if (userPrompt) {
    userQuery += `\nUser's Goal / Specific Instructions for this message: "${userPrompt}"\n`;
  } else if (!templateText) {
     // Should not happen due to checks in serve() but as a safeguard
    return { message: "Error: No prompt or template provided."};
  }

  userQuery += tripContextInfo; // Add fetched trip context here

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userQuery }
      ],
      model: "gpt-4-turbo-preview",
      // max_tokens: 150, // Adjust as needed
      // temperature: 0.7, // Adjust for creativity vs. predictability
    });

    const messageContent = completion.choices[0]?.message?.content?.trim();

    if (!messageContent) {
      throw new Error("OpenAI returned an empty message.");
    }

    return { message: messageContent };

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // Log more specific error details if available
    if (error.response) {
      console.error("OpenAI API Response Error:", error.response.data);
    }
    // Return a more user-friendly error or rethrow for the main handler
    throw new Error(`Failed to generate AI message: ${error.message}`);
  }
}

async function classifyMessagePriority(messageContent: string, tripContext?: any) {
  if (!openai) {
    console.error("OpenAI client not initialized in classifyMessagePriority.");
    // Fallback to a default priority or handle error as appropriate
    return { priority: 'none', score: 0, reason: "OpenAI client not available." };
  }

  console.log(`Classifying priority for message: "${messageContent}"`);
  // Optional: Enhance context with trip details if provided
  let contextInfo = "The message is part of a group trip conversation.";
  if (tripContext) {
    // Example: if tripContext = { type: "Bachelorette Party", currentPhase: "Planning dinner" }
    // contextInfo += ` Trip Type: ${tripContext.type}. Current Focus: ${tripContext.currentPhase}.`;
  }

  const systemPrompt = `You are an AI assistant classifying messages from a group trip chat. Determine the priority:
- URGENT: Critical, time-sensitive information (e.g., flight changes, meeting cancellations, emergencies, immediate deadlines).
- REMINDER: Important but not immediately critical (e.g., upcoming dinner reservations, packing lists, check-out times, payment due soon).
- FYI: General information, social chatter, jokes, non-actionable updates, past events.
- none: If unsure or doesn't fit other categories.

Respond with a JSON object containing "priority" (string: "urgent", "reminder", "fyi", or "none"), "score" (float: 0.0-1.0 confidence), and "reason" (string: brief justification).
Example: {"priority": "urgent", "score": 0.95, "reason": "Mentions flight delay and immediate action."}
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${contextInfo}\n\nMessage to classify: "${messageContent}"` }
      ],
      model: "gpt-3.5-turbo", // Or gpt-4-turbo for potentially better accuracy
      response_format: { type: "json_object" }, // Request JSON output
      // temperature: 0.2, // Lower temperature for more deterministic classification
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    if (!responseContent) {
      throw new Error("OpenAI returned an empty response for priority classification.");
    }

    const parsedResponse = JSON.parse(responseContent);
    // Basic validation of the parsed response
    if (!['urgent', 'reminder', 'fyi', 'none'].includes(parsedResponse.priority) ||
        typeof parsedResponse.score !== 'number' ||
        typeof parsedResponse.reason !== 'string') {
      console.error("OpenAI returned improperly formatted JSON:", responseContent);
      throw new Error("Received improperly formatted JSON from OpenAI for priority classification.");
    }

    console.log("Priority classification result:", parsedResponse);
    return parsedResponse; // { priority: "urgent", score: 0.9, reason: "..." }

  } catch (error) {
    console.error("Error calling OpenAI API for priority classification:", error);
    // Log more specific error details if available
    if (error.response) {
      console.error("OpenAI API Response Error (Priority):", error.response.data);
    }
    // Fallback or rethrow
    return { priority: 'none', score: 0, reason: `Failed to classify: ${error.message}` };
  }
}

async function suggestOptimalSendTime(tripId: string, messagePurpose: string, currentMessageUrgency?: 'urgent' | 'reminder' | 'fyi' | 'none') {
  if (!openai) {
    console.error("OpenAI client not initialized in suggestOptimalSendTime.");
    return { suggestions: [], error: "OpenAI client not available." };
  }

  console.log(`Suggesting send time for trip ${tripId}, purpose: "${messagePurpose}", urgency: ${currentMessageUrgency || 'not set'}`);

  // 1. Fetch trip context (events, participants, etc.)
  //    fetchTripContext already provides Upcoming Events, Trip Name, Dates, Participants.
  //    We might want to ensure it fetches events further out if suggesting times for non-imminent things.
  //    For now, we'll use the existing context from fetchTripContext.
  const tripContextInfo = await fetchTripContext(tripId);
  if (!tripContextInfo && (!currentMessageUrgency || currentMessageUrgency !== 'urgent')) { // If no context and not urgent, hard to suggest
      return { suggestions: [], error: "Insufficient trip context to make a suggestion."};
  }

  // 2. Construct the prompt for OpenAI
  //    The AI should return a JSON object with suggestions.
  //    Each suggestion: { suggested_time_utc: "ISO_STRING", reasoning: "string", confidence: "high/medium/low" }
  const systemPrompt = `You are an AI assistant helping a trip organizer determine the best time to send a message.
Consider these factors:
- Proximity to relevant events: Messages should ideally be sent X hours before an event if related.
- User engagement: Mornings (e.g., 8-9 AM local time) are good for daily schedules. Evenings (e.g., 7-9 PM local time) for next-day prep.
- Avoid "dead zones": Don't suggest times very late at night (e.g., past 11 PM local) or very early morning (e.g., before 7 AM local) unless the message is URGENT.
- Message Urgency: If 'urgent', it might need to be sent ASAP, overriding optimal times. If 'reminder', it should precede the event. If 'fyi', it's more flexible.
- Notification Fatigue: Avoid suggesting times that would cluster many messages too closely if possible (though this is hard without knowing other scheduled messages).
- Current Time: (Will be provided in user prompt) Assume "now" is when the user is asking. Suggestions should be for the future.

Respond with a JSON object containing an array called "suggestions". Each object in the array should have:
- "suggested_time_utc": An ISO 8601 UTC string (e.g., "2024-07-15T14:00:00Z").
- "reasoning": A brief explanation for why this time is suggested.
- "confidence": A string ("high", "medium", "low") indicating your confidence.
Return 1 to 3 suggestions. If no good suggestion can be made, return an empty array or a reason.
Example: {"suggestions": [{"suggested_time_utc": "2024-07-15T14:00:00Z", "reasoning": "2 hours before the listed 'Team Lunch' event.", "confidence": "high"}]}
`;

  const nowUTC = new Date();
  let userQuery = `Current UTC time is: ${nowUTC.toISOString()}\n`;
  userQuery += `Message Purpose/Goal: "${messagePurpose}"\n`;
  if (currentMessageUrgency && currentMessageUrgency !== 'none') {
    userQuery += `Assessed Message Urgency: ${currentMessageUrgency}\n`;
  }
  userQuery += `\nRelevant ${tripContextInfo}`; // tripContextInfo already starts with "\n\nTrip Context..."

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ],
      model: "gpt-4-turbo-preview", // GPT-4 might be better for complex reasoning like this
      response_format: { type: "json_object" },
      // temperature: 0.3, // Lower temp for more deterministic/sensible suggestions
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    if (!responseContent) {
      throw new Error("OpenAI returned an empty response for send time suggestion.");
    }

    const parsedResponse = JSON.parse(responseContent);

    // Validate response structure (basic)
    if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
      console.error("OpenAI returned improperly formatted JSON for send time suggestions:", responseContent);
      throw new Error("Received improperly formatted JSON from OpenAI for send time suggestions.");
    }

    // Further validation for each suggestion can be added here (e.g., valid ISO time)
    parsedResponse.suggestions.forEach((s: any) => {
        if (!s.suggested_time_utc || isNaN(new Date(s.suggested_time_utc).getTime())) {
            console.warn("Invalid suggested_time_utc found in suggestion:", s);
            // Optionally filter out invalid suggestions or mark them
        }
    });


    console.log("Send time suggestions:", parsedResponse);
    return parsedResponse; // e.g., { suggestions: [{ suggested_time_utc: "...", reasoning: "...", confidence: "..." }] }

  } catch (error) {
    console.error("Error calling OpenAI API for send time suggestion:", error);
    if (error.response) {
      console.error("OpenAI API Response Error (Suggest Time):", error.response.data);
    }
    return { suggestions: [], error: `Failed to suggest send time: ${error.message}` };
  }
}
