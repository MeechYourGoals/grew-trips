# Chravel Developer Handbook

## 🎯 **Project Overview**

**Chravel** is a comprehensive travel coordination platform that combines group chat, AI concierge, task management, payments, and itinerary planning into a unified experience. Built with React/TypeScript and powered by Google Gemini AI.

---

## 🏗️ **Architecture Overview**

### **Frontend Stack**
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + **Radix UI** for styling
- **Capacitor** for mobile deployment
- **React Query** for state management
- **React Router** for navigation

### **Backend Stack**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **Google Gemini AI** (via Lovable Gateway)
- **Google Maps API** (Places, Geocoding, Grounding)
- **Edge Functions** (Deno runtime)

### **Mobile Stack**
- **Capacitor** for native iOS/Android
- **Swift/Objective-C** (iOS) via Capacitor bridge
- **Kotlin/Java** (Android) via Capacitor bridge

---

## 🚀 **Core Features & Implementation**

### **1. AI Concierge System**
**Purpose:** Context-aware travel assistant with full trip intelligence

**Backend Implementation:**
- `supabase/functions/lovable-concierge/index.ts` - Main AI endpoint
- `supabase/functions/place-grounding/index.ts` - Google Maps grounding
- `src/services/universalConciergeService.ts` - Frontend integration

**Key Capabilities:**
- **Payment Intelligence**: "Who do I owe money to?" queries
- **Poll Awareness**: "Where did everyone decide on dinner?"
- **Task Management**: "What tasks am I responsible for?"
- **Calendar Mastery**: "What time is dinner?" with addresses
- **Chat Intelligence**: "What did I miss in the chat?" summarization
- **Enterprise Mode**: Automatic detection for large groups (minimal emojis)

**Context Data Sources:**
- Trip participants, basecamp location, preferences
- Payment history, poll results, task assignments
- Calendar events, chat history, spending patterns
- Google Maps grounding for location-based responses

### **2. Unified Messaging System**
**Purpose:** Single chat interface for all communication

**Primary Component:** `src/components/TripChat.tsx`
**Service:** `src/services/unifiedMessagingService.ts`

**Features:**
- Real-time messaging with Supabase subscriptions
- Broadcast messages for important announcements
- Payment requests and receipts
- AI Concierge integration with Google Maps widgets
- Message reactions and replies
- Mobile-optimized interface

**Backend:**
- `supabase/functions/unified-messaging/index.ts`
- Real-time subscriptions via Supabase channels
- Message templates and scheduled messages

### **3. Task Management System**
**Purpose:** Collaborative task tracking and assignment

**Primary Hook:** `src/hooks/useTripTasks.ts` (consolidated)
**Components:** `src/components/todo/` directory

**Features:**
- Task creation, assignment, and status tracking
- Category-based organization
- Due date management
- Bulk operations
- Mobile-optimized task interface

**Backend:**
- `trip_tasks` table in Supabase
- Real-time updates via subscriptions
- Task assignment and notification system

### **4. Payment & Expense Tracking**
**Purpose:** Group expense management and splitting

**Components:** `src/components/payments/` directory
**Services:** `src/services/paymentService.ts`, `src/services/paymentBalanceService.ts`

**Features:**
- Receipt scanning and AI parsing
- Automatic expense splitting
- Payment method management
- Balance tracking and settlements
- Integration with AI Concierge for payment queries

**Backend:**
- `trip_payments` table
- Receipt parsing via AI
- Payment calculation algorithms

### **5. Google Maps Integration**
**Purpose:** Location services and venue discovery

**Service:** `src/services/googleMapsService.ts`
**Proxy:** `supabase/functions/google-maps-proxy/index.ts`

**Features:**
- Basecamp location selection with hybrid autocomplete
- Google Places Text Search for venue discovery
- Interactive Maps widgets in chat responses
- Geocoding and reverse geocoding
- Google Maps grounding for AI responses

**API Endpoints:**
- `autocomplete` - Place suggestions
- `text-search` - Natural language venue search
- `geocode` - Address to coordinates
- `place-details` - Detailed venue information

### **6. Poll & Decision Making**
**Purpose:** Group decision coordination

**Components:** `src/components/polls/` directory
**Integration:** AI Concierge awareness of poll results

**Features:**
- Multiple choice polls
- Real-time voting
- Result visualization
- Integration with AI for decision summaries

### **7. Calendar & Itinerary**
**Purpose:** Trip scheduling and event management

**Components:** `src/components/calendar/` directory
**Integration:** AI Concierge calendar queries

**Features:**
- Event creation and management
- Time zone handling
- Integration with basecamp location
- AI-powered schedule optimization

---

## 🔧 **Development Setup**

### **Prerequisites**
```bash
# Node.js 18+ (use nvm)
nvm install 18
nvm use 18

# Install dependencies
npm install

# Install Supabase CLI
npm install -g supabase
```

### **Environment Variables**
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Lovable AI Gateway
LOVABLE_API_KEY=your_lovable_api_key
```

### **Development Commands**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Start Supabase locally
supabase start
```

---

## 📱 **Mobile Development**

### **Capacitor Setup**
```bash
# Add native platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios      # Requires Xcode (Mac only)
npx cap open android  # Requires Android Studio
```

### **Mobile-Specific Features**
- **Native Camera**: Receipt scanning, photo sharing
- **Push Notifications**: Real-time message alerts
- **Haptic Feedback**: Touch responses
- **Geolocation**: Automatic basecamp detection
- **Offline Support**: Service worker caching

### **Platform-Specific Code**
- **iOS**: Swift/Objective-C via Capacitor bridge
- **Android**: Kotlin/Java via Capacitor bridge
- **Web**: Standard React components

---

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Trip management
trips (id, title, location, start_date, end_date, basecamp, participants)
trip_members (trip_id, user_id, role, permissions)

-- Messaging
trip_chat_messages (id, trip_id, content, author_name, created_at, privacy_mode)
trip_broadcasts (id, trip_id, content, author_name, created_at)

-- Tasks
trip_tasks (id, trip_id, title, description, assigned_to, status, due_date)

-- Payments
trip_payments (id, trip_id, amount, description, participants, payment_method)
trip_receipts (id, trip_id, amount, description, participants, receipt_image)

-- Polls
trip_polls (id, trip_id, question, options, results, created_at)

-- Events
trip_events (id, trip_id, title, start_date, end_date, location, address)
```

---

## 🔌 **API Endpoints**

### **Supabase Edge Functions**
```
/functions/lovable-concierge     - AI Concierge with Google Maps grounding
/functions/place-grounding       - Place-specific AI responses
/functions/google-maps-proxy     - Google Maps API proxy
/functions/unified-messaging     - Message management
/functions/ai-search            - Trip data search
/functions/receipt-parser       - Receipt AI parsing
```

### **External APIs**
- **Google Gemini**: AI responses via Lovable Gateway
- **Google Maps**: Places, Geocoding, Grounding
- **Supabase**: Database, Auth, Real-time subscriptions

---

## 🚨 **Critical Implementation Notes**

### **1. AI Concierge Context**
The AI Concierge has access to ALL trip data:
- Payment history and balances
- Poll results and group decisions
- Task assignments and status
- Calendar events with addresses
- Chat history for summarization
- Basecamp location for local recommendations

### **2. Google Maps Grounding**
- Only triggers for location-based queries
- Uses trip basecamp coordinates for accuracy
- Returns interactive Maps widgets
- Provides verified source citations
- Cost-optimized with smart detection

### **3. Real-time Subscriptions**
- Chat messages via Supabase channels
- Task updates and assignments
- Payment notifications
- Poll result updates

### **4. Mobile Optimization**
- Touch targets 44px+ for accessibility
- Virtual scrolling for performance
- Offline-first architecture
- Native camera integration

---

## 🎯 **Production Readiness Status**

### **Web Version: 85% Ready**
✅ **Completed:**
- AI Concierge with full contextual awareness
- Google Maps grounding integration
- Unified messaging system
- Task management consolidation
- Payment tracking system
- Mobile-responsive design

⚠️ **Remaining:**
- Security vulnerability fixes
- Type safety improvements
- Bundle size optimization
- Final testing and polish

### **Mobile App: 70% Ready**
✅ **Completed:**
- Capacitor integration
- Mobile-optimized components
- Native camera integration
- Push notification setup
- Offline support architecture

⚠️ **Remaining:**
- iOS App Store configuration
- Android Play Store setup
- Native plugin optimization
- Performance tuning

---

## 🔄 **Sync Strategy for Web + Mobile**

### **Current Architecture**
- **Single Codebase**: React/TypeScript shared between web and mobile
- **Capacitor Bridge**: Translates web code to native iOS/Android
- **Shared Backend**: Same Supabase database and APIs
- **Real-time Sync**: Supabase subscriptions work across platforms

### **How It Works**
1. **Web Version**: Standard React app deployed to web
2. **Mobile Version**: Same React code wrapped by Capacitor
3. **Native Features**: Camera, notifications, haptic feedback via Capacitor plugins
4. **Data Sync**: Same Supabase backend ensures real-time sync
5. **User Experience**: Seamless transition between web and mobile

### **Benefits of Single Codebase**
- **Faster Development**: Write once, deploy everywhere
- **Consistent UX**: Same interface across platforms
- **Easier Maintenance**: Single codebase to update
- **Real-time Sync**: Changes appear instantly on all devices

---

## 📋 **Next Steps for Production**

### **Immediate (1-2 weeks)**
1. Fix remaining security vulnerabilities
2. Complete type safety improvements
3. Optimize bundle size
4. Final testing and bug fixes

### **Mobile App Store (2-4 weeks)**
1. Set up Apple Developer account
2. Configure iOS App Store metadata
3. Test on physical devices
4. Submit for App Store review

### **Long-term Enhancements**
1. Advanced AI features
2. Enterprise-specific optimizations
3. Performance monitoring
4. Analytics integration

---

## 🆘 **Troubleshooting**

### **Common Issues**
- **Build Errors**: Check TypeScript types and imports
- **Mobile Issues**: Ensure Capacitor plugins are properly configured
- **AI Responses**: Verify Lovable API key and Google Maps credentials
- **Real-time Issues**: Check Supabase connection and RLS policies

### **Debug Tools**
- **React DevTools**: Component inspection
- **Supabase Dashboard**: Database and auth debugging
- **Capacitor DevTools**: Mobile debugging
- **Network Tab**: API call inspection

---

## 📞 **Support & Resources**

- **Documentation**: This file + inline code comments
- **Supabase Docs**: https://supabase.com/docs
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Google Maps Docs**: https://developers.google.com/maps
- **React Docs**: https://react.dev

---

*Last Updated: December 2024*
*Version: 1.0.0*
