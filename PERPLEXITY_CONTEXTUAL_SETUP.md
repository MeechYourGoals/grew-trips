# Perplexity AI Contextual Search Setup Guide

## Current Issues Found & Fixes Applied

### 🐛 **Bugs Identified and Fixed:**

1. **Missing Database Table**: The `ai_conversations` table was referenced in code but didn't exist in the database
   - ✅ **Fixed**: Created migration `20250115000002_ai_conversations_table.sql`

2. **Limited Contextual Data**: Perplexity was only doing web searches without access to user's trip data
   - ✅ **Fixed**: Updated `PerplexityChat.tsx` to use `EnhancedTripContextService`

3. **Missing Contextual Data Tables**: Database lacked tables for links, polls, chat messages, files, and preferences
   - ✅ **Fixed**: Created migration `20250115000003_contextual_data_tables.sql`

4. **Mock Data Instead of Real Data**: Enhanced service was using hardcoded mock data
   - ✅ **Fixed**: Updated `EnhancedTripContextService` to fetch from database

---

## 🚀 **How to Set Up Contextual Awareness**

### **Step 1: Run Database Migrations**

Execute the new migration files to create the required tables:

```bash
# Run these migrations in your Supabase dashboard or via CLI
supabase migration up
```

**New tables created:**
- `ai_conversations` - Stores AI chat history
- `trip_links` - User-shared links with votes and categories
- `trip_polls` - Group polls and voting results  
- `trip_chat_messages` - Chat history with sentiment analysis
- `trip_files` - Uploaded files with AI summaries
- `trip_preferences` - Group preferences and budget settings

### **Step 2: Verify Perplexity API Configuration**

Ensure your Perplexity API key is configured in Supabase:

```bash
# In Supabase Edge Functions settings, add:
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### **Step 3: Enable Contextual Data Collection**

The system now automatically collects contextual data from:

#### **Links & Ideas**
- Users can share restaurant links, activity suggestions, etc.
- Perplexity will reference these in recommendations
- Voting system helps prioritize popular suggestions

#### **Group Polls**  
- Create polls for group decisions
- AI understands voting patterns and consensus levels
- Helps make recommendations aligned with group preferences

#### **Chat Messages**
- Recent chat sentiment influences AI tone and suggestions
- Group mood analysis (positive/negative/neutral)
- Context from recent conversations

#### **Uploaded Files**
- PDF tickets, restaurant menus, itineraries
- AI extracts key information and events
- References file content in recommendations

#### **Trip Preferences**
- Dietary restrictions, budget ranges, activity preferences
- Accessibility requirements, lifestyle choices
- Time preferences (early riser vs night owl)

### **Step 4: Test Contextual Awareness**

1. **Create sample data** in your database:

```sql
-- Example: Add trip preferences
INSERT INTO trip_preferences (trip_id, dietary, vibe, budget_min, budget_max) 
VALUES ('your-trip-id', '{"Vegetarian", "Gluten-free"}', '{"Adventure", "Cultural"}', 50, 150);

-- Example: Add a shared link
INSERT INTO trip_links (trip_id, url, title, description, category, votes, added_by)
VALUES ('your-trip-id', 'https://example-restaurant.com', 'Amazing Local Bistro', 'Great reviews for dinner', 'restaurant', 8, 'user-id');

-- Example: Add chat message
INSERT INTO trip_chat_messages (trip_id, content, author_id, author_name, sentiment)
VALUES ('your-trip-id', 'Super excited for this trip!', 'user-id', 'John Doe', 'positive');
```

2. **Test the AI concierge** - Ask questions like:
   - "Where should we eat dinner tonight?" (considers dietary restrictions, shared links, budget)
   - "What activities match our group's vibe?" (uses preference data)
   - "Suggest something we haven't done yet" (avoids visited places)

---

## 🧠 **How Contextual Awareness Works**

### **Enhanced System Prompt**
The AI now receives a comprehensive context including:

```
=== TRIP CONTEXT ===
Destination: Los Angeles, CA
Travel Dates: Feb 14-18, 2025
Group Size: 4 travelers
Participants: John, Sarah, Mike, Emma

=== GROUP PREFERENCES ===
Dietary: Vegetarian, Gluten-free
Vibes: Adventure, Cultural, Nightlife
Budget Range: $50 - $150 per person

=== SHARED LINKS & IDEAS ===
- Republique Restaurant (restaurant, 8 votes): French bistro in Mid-City
- Best Museums in LA (activities, 5 votes): Guide to top art museums

=== ACTIVE POLLS & DECISIONS ===
- What should we do Sunday afternoon?: Leading option is "Beach time at Santa Monica" (6/11 votes)

=== RECENT GROUP CHAT SENTIMENT ===
Group Mood: Very positive
Recent Topics: "Super excited for this trip!"; "Found an amazing restaurant!"

=== UPLOADED FILES & CONTENT ===
- Dodgers Game Tickets.pdf: Baseball game tickets for February 15th at Dodger Stadium
- Restaurant Menu.jpg: Upscale French restaurant menu with prix fixe dining option
```

### **Smart Recommendations**
With this context, Perplexity can:

- **Avoid repetition**: Won't suggest places you've already visited
- **Match preferences**: Considers dietary restrictions and budget
- **Reference shared content**: "I see you have tickets to the Dodgers game..."
- **Factor group dynamics**: Adapts to group consensus level and mood
- **Location awareness**: Uses basecamp location for proximity-based suggestions
- **Real-time data**: Combines contextual data with live web search

---

## 📊 **Monitoring & Analytics**

### **Conversation Tracking**
All AI conversations are now stored in `ai_conversations` table with:
- Token usage tracking
- Response time monitoring  
- Conversation type classification
- Model version tracking

### **Context Quality Metrics**
Monitor the quality of contextual data:
- Number of shared links per trip
- Poll participation rates
- Chat message sentiment distribution
- File upload and processing success rates

---

## 🔧 **Advanced Configuration**

### **Custom Context Weights**
Modify `PerplexityConciergeService.buildSystemPrompt()` to adjust how much weight different context types receive:

```typescript
// Emphasize recent chat sentiment more
if (tripContext.chatHistory?.length) {
  systemPrompt += `\n\n=== RECENT GROUP SENTIMENT (HIGH PRIORITY) ===`;
  // ... sentiment analysis
}
```

### **Context Filtering**
Add filters to exclude certain types of context based on trip type or user preferences:

```typescript
// Skip budget info for luxury trips
if (tripContext.preferences?.budgetMax > 500) {
  // Don't include budget constraints in prompt
}
```

### **Real-time Context Updates**
The system automatically updates context as users:
- Add new links or files
- Send chat messages  
- Vote in polls
- Update preferences

---

## 🎯 **Expected Results**

After setup, your Perplexity AI concierge will provide:

✅ **Personalized recommendations** based on group preferences
✅ **Context-aware suggestions** referencing shared content
✅ **Budget-conscious options** within specified ranges
✅ **Sentiment-appropriate responses** matching group mood
✅ **Location-optimized suggestions** from current basecamp
✅ **Avoid redundancy** by tracking visited places
✅ **Group consensus awareness** from poll results

The AI transforms from a generic web search tool into a truly contextual travel assistant that understands your specific trip, group dynamics, and preferences.

---

## 🔍 **Troubleshooting**

### **Context Not Loading**
- Check database table permissions (RLS policies)
- Verify trip IDs match between tables
- Check Supabase client connection

### **Missing Contextual Data**
- Ensure data is being inserted into the new tables
- Check the `EnhancedTripContextService` error logs
- Verify foreign key relationships

### **Performance Issues**
- Database queries are optimized with indexes
- Context is limited to recent/relevant data
- Consider caching for frequently accessed trips

Contact the development team if you encounter any issues with the contextual search setup.