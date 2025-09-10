-- Create seed trip members for consumer trips so users can interact with demo trips
-- This ensures that all users can immediately use the demo trip functionality

-- First, create a dummy user ID for seed members (using a UUID that represents system)
-- We'll use the authenticated user's ID when they interact with the trip

-- Add seed members for consumer trips 1-12
-- These will be updated to actual user IDs when users first interact with trips
INSERT INTO public.trip_members (trip_id, user_id, role, created_at, updated_at) VALUES
('1', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('2', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('3', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('4', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('5', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('6', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('7', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('8', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('9', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('10', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('11', '00000000-0000-0000-0000-000000000000', 'member', now(), now()),
('12', '00000000-0000-0000-0000-000000000000', 'member', now(), now());

-- Create a function to auto-join users to consumer trips when they first interact
CREATE OR REPLACE FUNCTION public.ensure_trip_membership(p_trip_id text, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    membership_exists boolean := false;
    is_consumer_trip boolean := false;
BEGIN
    -- Check if this is a consumer trip (ID 1-12)
    is_consumer_trip := p_trip_id IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
    
    -- Only auto-join for consumer trips
    IF NOT is_consumer_trip THEN
        RETURN false;
    END IF;
    
    -- Check if user is already a member
    SELECT EXISTS(
        SELECT 1 FROM trip_members 
        WHERE trip_id = p_trip_id AND user_id = p_user_id
    ) INTO membership_exists;
    
    -- If not a member, add them
    IF NOT membership_exists THEN
        INSERT INTO trip_members (trip_id, user_id, role)
        VALUES (p_trip_id, p_user_id, 'member')
        ON CONFLICT (trip_id, user_id) DO NOTHING;
        RETURN true;
    END IF;
    
    RETURN membership_exists;
END;
$$;