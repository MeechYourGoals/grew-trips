# Concierge Setup Instructions

## Critical Setup Required

Your Concierge chat is currently showing "Limited Mode" because the `OPENAI_API_KEY` secret is missing from your Supabase project.

### ✅ **Step 1: Add OpenAI API Key to Supabase Secrets**

1. **Get your OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key if you don't have one
   - Copy the key (starts with `sk-...`)

2. **Add to Supabase Secrets:**
   - Go to your Supabase dashboard
   - Navigate to **Project Settings** → **Environment Variables**
   - Click **Add Variable**
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Click **Save**

3. **Re-deploy Edge Functions:**
   - After adding the secret, you MUST re-deploy the edge function
   - In your Supabase dashboard, go to **Edge Functions**
   - Find `openai-chat` function and click **Deploy**
   - Wait for deployment to complete

### ✅ **Step 2: Test the Integration**

1. Go back to your trip page
2. Open the Concierge chat (PLUS feature)
3. Try asking: "Where should I eat tonight?"
4. You should get real AI responses instead of "Limited Mode"

### ✅ **What's Fixed**

**UI/UX Improvements:**
- ✅ Removed all "OpenAI" branding from user interface
- ✅ Changed "OpenAI Concierge" to just "Concierge"
- ✅ Updated example queries to be more natural:
  - "Where should I eat tonight?"
  - "Where are we staying again?" (shows basecamp)
  - "What time is dinner again?"
  - "What's the address of the day party location we're going to tomorrow?"
- ✅ Removed debug commands like "/context" and "/health" from examples
- ✅ Improved error messages to be user-friendly
- ✅ Removed technical jargon from status messages

**Technical Fixes:**
- ✅ Fixed request format mismatch between frontend and edge function
- ✅ Updated edge function to properly handle the new request structure
- ✅ Improved system prompt integration
- ✅ Enhanced error handling throughout the pipeline
- ✅ Removed all fallback logic and debug commands
- ✅ Streamlined the entire chat flow

### 🚨 **Expected Behavior After Setup**

**Before Setup (Current):**
- Status shows "Limited Service" or "Unavailable"
- User sees "Your concierge is experiencing technical difficulties"
- No real AI responses

**After Setup (Target):**
- Status shows "Ready" with green checkmark
- Users get real, contextual AI responses about their trip
- Concierge uses trip context, basecamp location, and preferences
- Responses are personalized to the specific trip details

### 🔧 **Troubleshooting**

If you're still seeing issues after setup:

1. **Check API Key Format:**
   - Must start with `sk-`
   - No extra spaces or characters
   - Key must be active and have credits

2. **Verify Edge Function Deployment:**
   - Check Supabase Edge Functions logs
   - Look for "OpenAI API key not configured" errors
   - Re-deploy if needed

3. **Test API Key:**
   - You can test your OpenAI key directly at: https://platform.openai.com/playground

4. **Check Network Logs:**
   - Open browser dev tools
   - Look for 400/401 errors to the openai-chat function
   - Should return 200 with AI responses

### 💡 **Cost Information**

- OpenAI charges per token used
- Typical trip questions cost $0.01-0.05 per interaction
- Set usage limits in your OpenAI dashboard if desired

---

Once you complete Step 1 and Step 2, your Concierge will provide real, intelligent responses about the user's trip without any technical jargon or OpenAI branding visible to end users.