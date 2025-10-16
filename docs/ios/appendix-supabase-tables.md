# Appendix A: Supabase Tables

**Purpose**: Key database tables and their RLS policies for iOS implementation

---

## Core Tables

### trips

**Columns**:
- `id` (text, PK)
- `name` (text)
- `description` (text)
- `destination` (text)
- `start_date` (date)
- `end_date` (date)
- `cover_image_url` (text)
- `trip_type` (text) - `'consumer'`, `'pro'`, `'event'`
- `basecamp_name` (text)
- `basecamp_address` (text)
- `privacy_mode` (text) - `'standard'`, `'high'`
- `ai_access_enabled` (boolean)
- `is_archived` (boolean)
- `created_by` (uuid, FK → auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Trip creators can create trips`: INSERT if `auth.uid() = created_by`
- `Trip creators can update their trips`: UPDATE if `auth.uid() = created_by`
- `Trip members can view trips`: SELECT if user is in `trip_members`

---

### trip_members

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `user_id` (uuid, FK → auth.users)
- `role` (text) - `'admin'`, `'member'`, `'viewer'`
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Users can view their trip memberships`: SELECT if `auth.uid() = user_id`

**Note**: Membership creation is typically handled by server-side triggers or invite acceptance flows.

---

### trip_chat_messages

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `sender_id` (uuid, FK → auth.users)
- `content` (text)
- `message_type` (text) - `'text'`, `'image'`, `'file'`, `'system'`
- `metadata` (jsonb) - For reactions, @mentions, attachments
- `is_deleted` (boolean)
- `edited` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Trip members can view messages`: SELECT if user is in `trip_members`
- `Trip members can send messages`: INSERT if user is in `trip_members` and `auth.uid() = sender_id`
- `Senders can update their messages`: UPDATE if `auth.uid() = sender_id`
- `Senders can soft-delete their messages`: UPDATE (is_deleted) if `auth.uid() = sender_id`

---

### trip_events

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `title` (text)
- `description` (text)
- `location` (text)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `event_category` (text) - `'accommodation'`, `'food'`, `'transport'`, `'activity'`, `'other'`
- `include_in_itinerary` (boolean)
- `source_type` (text) - `'manual'`, `'ai'`, `'import'`
- `source_data` (jsonb)
- `created_by` (uuid, FK → auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `version` (integer) - For optimistic locking

**RLS Policies**:
- `Trip members can view events`: SELECT if user is in `trip_members`
- `Trip members can create events`: INSERT if user is in `trip_members` and `auth.uid() = created_by`
- `Event creators can update their events`: UPDATE if `auth.uid() = created_by`
- `Event creators can delete their events`: DELETE if `auth.uid() = created_by`

**Special Function**: `create_event_with_conflict_check` - Prevents overlapping events

---

### trip_tasks

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `title` (text)
- `description` (text)
- `creator_id` (uuid, FK → auth.users)
- `due_at` (timestamptz)
- `completed` (boolean)
- `completed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `version` (integer) - For optimistic locking

**RLS Policies**:
- `Trip members can view tasks`: SELECT if user is in `trip_members`
- `Trip members can create tasks`: INSERT if user is in `trip_members` and `auth.uid() = creator_id`
- `Task creators can update their tasks`: UPDATE if `auth.uid() = creator_id`
- `Task creators can delete their tasks`: DELETE if `auth.uid() = creator_id`

**Special Function**: `toggle_task_status` - Per-user completion with version check

---

### task_assignments

**Columns**:
- `id` (uuid, PK)
- `task_id` (uuid, FK → trip_tasks.id)
- `user_id` (uuid, FK → auth.users)
- `assigned_by` (uuid, FK → auth.users)
- `assigned_at` (timestamptz)

**RLS Policies**:
- `Trip members can view task assignments`: SELECT if user is in `trip_members` for the task's trip
- `Trip members can assign tasks`: INSERT if user is in `trip_members` and `auth.uid() = assigned_by`

---

### trip_polls

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `question` (text)
- `options` (jsonb) - Array of `{ id, text, voteCount, voters }`
- `status` (text) - `'active'`, `'closed'`
- `total_votes` (integer)
- `created_by` (uuid, FK → auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `version` (integer) - For optimistic locking

**RLS Policies**:
- `Members can read trip_polls`: SELECT if user is in `trip_members` or `auth.uid() = created_by`
- `Owners can insert trip_polls`: INSERT if `auth.uid() = created_by`
- `Owners can update trip_polls`: UPDATE if `auth.uid() = created_by`
- `Owners can delete trip_polls`: DELETE if `auth.uid() = created_by`

**Special Function**: `vote_on_poll` - Prevents double voting, increments count

---

### trip_media_index

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `media_type` (text) - `'photo'`, `'video'`, `'audio'`, `'file'`
- `media_url` (text)
- `filename` (text)
- `mime_type` (text)
- `file_size` (integer) - Bytes
- `message_id` (uuid, FK → trip_chat_messages.id) - If from chat
- `metadata` (jsonb)
- `created_at` (timestamptz)

**RLS Policies**:
- `Members can view trip media`: SELECT if user is in `trip_members`
- `Members can insert trip media`: INSERT if user is in `trip_members`

**Usage**: Aggregate `file_size` to calculate storage quota

---

### trip_invites

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `code` (text, unique)
- `created_by` (uuid, FK → auth.users)
- `expires_at` (timestamptz)
- `max_uses` (integer)
- `current_uses` (integer)
- `is_active` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Anyone can view active trip invites`: SELECT if `is_active = true`
- `Users can create trip invites`: INSERT if `auth.uid() = created_by`
- `Users can update their own trip invites`: UPDATE if `auth.uid() = created_by`

---

### broadcasts

**Columns**:
- `id` (uuid, PK)
- `trip_id` (text, FK → trips.id)
- `sender_id` (uuid, FK → auth.users)
- `message` (text)
- `priority` (text) - `'normal'`, `'urgent'`
- `timestamp` (timestamptz)
- `read_by` (jsonb) - Array of user UUIDs

**RLS Policies**:
- `Trip members can view broadcasts`: SELECT if user is in `trip_members`
- `Trip members can create broadcasts`: INSERT if user is in `trip_members` and `auth.uid() = sender_id`

---

### broadcast_reactions

**Columns**:
- `id` (uuid, PK)
- `broadcast_id` (uuid, FK → broadcasts.id)
- `user_id` (uuid, FK → auth.users)
- `reaction_type` (text) - Emoji or reaction name
- `created_at` (timestamptz)

**RLS Policies**:
- `Trip members can view reactions`: SELECT if user is in `trip_members` for the broadcast's trip
- `Users can manage their own reactions`: ALL if `auth.uid() = user_id`

---

## Organization Tables (Enterprise)

### organizations

**Columns**:
- `id` (uuid, PK)
- `name` (text)
- `display_name` (text)
- `subscription_tier` (enum) - `'starter'`, `'growing'`, `'enterprise'`, `'enterprise-plus'`
- `subscription_status` (enum) - `'active'`, `'trial'`, `'cancelled'`, `'expired'`
- `seat_limit` (integer)
- `seats_used` (integer)
- `trial_ends_at` (timestamptz)
- `subscription_ends_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Authenticated users can create organizations`: INSERT if `auth.uid() IS NOT NULL`
- `Organization members can view their organizations`: SELECT if user is in `organization_members`
- `Organization admins can update their organizations`: UPDATE if user is admin in `organization_members`

---

### organization_members

**Columns**:
- `id` (uuid, PK)
- `organization_id` (uuid, FK → organizations.id)
- `user_id` (uuid, FK → auth.users)
- `role` (enum) - `'owner'`, `'admin'`, `'member'`
- `seat_id` (text)
- `status` (text) - `'active'`, `'pending'`, `'suspended'`
- `invited_by` (uuid, FK → auth.users)
- `joined_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Organization members can view their org members`: SELECT if user is in `organization_members` for that org
- `Organization admins can manage members`: ALL if user is admin in `organization_members`

---

### game_schedules (Sports)

**Columns**:
- `id` (uuid, PK)
- `organization_id` (uuid, FK → organizations.id)
- `trip_id` (text, FK → trips.id) - Optional link
- `opponent` (text)
- `venue` (text)
- `venue_address` (text)
- `game_date` (date)
- `game_time` (time)
- `load_in_time` (time)
- `status` (text) - `'scheduled'`, `'confirmed'`, `'completed'`, `'cancelled'`
- `is_home` (boolean)
- `created_by` (uuid, FK → auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Org members manage game schedules`: ALL if user is in `organization_members` for that org

---

### show_schedules (Entertainment)

**Columns**:
- `id` (uuid, PK)
- `organization_id` (uuid, FK → organizations.id)
- `trip_id` (text, FK → trips.id) - Optional link
- `title` (text)
- `venue` (text)
- `venue_address` (text)
- `show_date` (date)
- `show_time` (time)
- `soundcheck_time` (time)
- `load_in_time` (time)
- `status` (text) - `'scheduled'`, `'confirmed'`, `'completed'`, `'cancelled'`
- `created_by` (uuid, FK → auth.users)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Org members manage show schedules`: ALL if user is in `organization_members` for that org

---

## User Tables

### profiles

**Columns**:
- `user_id` (uuid, PK, FK → auth.users.id)
- `display_name` (text)
- `email` (text)
- `phone` (text)
- `avatar_url` (text)
- `bio` (text)
- `first_name` (text)
- `last_name` (text)
- `show_email` (boolean) - Privacy toggle
- `show_phone` (boolean) - Privacy toggle
- `timezone` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Users can view their own profile`: SELECT if `auth.uid() = user_id`
- `Users can update their own profile`: UPDATE if `auth.uid() = user_id`

**Special Function**: `get_visible_profile_fields` - Returns profile with privacy filters applied

---

### user_roles

**Columns**:
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users.id)
- `role` (enum) - `'admin'`, `'pro'`, `'moderator'`, `'user'`
- `created_at` (timestamptz)

**RLS Policies**:
- `Users can view their own roles`: SELECT if `auth.uid() = user_id`

**Security**: Role checks use `has_role(_user_id, _role)` function (SECURITY DEFINER)

---

### loyalty_airlines / loyalty_hotels / loyalty_rentals

**Columns** (similar structure):
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users.id)
- `airline`/`hotel_chain`/`company` (text)
- `program_name` (text)
- `membership_number` (text)
- `tier` (text)
- `is_preferred` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies**:
- `Users manage own programs`: ALL if `auth.uid() = user_id`

---

## Key Security Functions

### has_role

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### is_org_member

```sql
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND status = 'active'
  )
$$;
```

### is_org_admin

```sql
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id 
      AND organization_id = _org_id 
      AND role IN ('owner', 'admin')
      AND status = 'active'
  )
$$;
```

---

## Swift Model Mapping

Use Codable to map tables to Swift structs:

```swift
struct Trip: Codable, Identifiable {
    let id: String
    let name: String
    let description: String?
    let destination: String?
    let startDate: Date?
    let endDate: Date?
    let coverImageUrl: String?
    let tripType: TripType
    let basecampName: String?
    let basecampAddress: String?
    let privacyMode: PrivacyMode
    let aiAccessEnabled: Bool
    let isArchived: Bool
    let createdBy: UUID
    let createdAt: Date
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, destination
        case startDate = "start_date"
        case endDate = "end_date"
        case coverImageUrl = "cover_image_url"
        case tripType = "trip_type"
        case basecampName = "basecamp_name"
        case basecampAddress = "basecamp_address"
        case privacyMode = "privacy_mode"
        case aiAccessEnabled = "ai_access_enabled"
        case isArchived = "is_archived"
        case createdBy = "created_by"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}
```

---

## Next Steps

- Review RLS policies in Supabase Dashboard
- Test policies with different user roles
- Monitor query performance with indexes
- Set up database triggers for audit logs
