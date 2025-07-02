-- Add priority-related columns to the messages table
-- NB: Adjust 'messages' to your actual messages table name if different.

-- First, create an ENUM type for priority if you prefer strong typing.
-- Alternatively, you can use VARCHAR and manage allowed values in your application.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_priority_enum') THEN
        CREATE TYPE message_priority_enum AS ENUM ('urgent', 'reminder', 'fyi', 'none');
    END IF;
END$$;

ALTER TABLE messages -- Replace 'messages' if your table name is different
ADD COLUMN IF NOT EXISTS priority message_priority_enum DEFAULT 'none',
ADD COLUMN IF NOT EXISTS priority_score NUMERIC(3, 2), -- e.g., 0.95 for 95% confidence
ADD COLUMN IF NOT EXISTS priority_reason TEXT, -- Optional: AI can provide a brief reason
ADD COLUMN IF NOT EXISTS priority_processed_at TIMESTAMPTZ;

-- Index to quickly find messages that haven't been processed for priority
CREATE INDEX IF NOT EXISTS idx_messages_priority_pending
ON messages (created_at)
WHERE priority = 'none' AND priority_processed_at IS NULL; -- Or some other logic to find unprocessed

COMMENT ON COLUMN messages.priority IS 'AI-classified priority of the message (urgent, reminder, fyi, none).';
COMMENT ON COLUMN messages.priority_score IS 'Confidence score from AI for the priority classification (0.00 to 1.00).';
COMMENT ON COLUMN messages.priority_reason IS 'Optional: Brief reason or keywords from AI for the classification.';
COMMENT ON COLUMN messages.priority_processed_at IS 'Timestamp of when the priority was last processed/updated by AI.';

-- Note:
-- If you choose not to use the ENUM type, change `message_priority_enum` to `VARCHAR(20)` or similar.
-- The index `idx_messages_priority_pending` is more useful for background processing (Option B).
-- For real-time processing (Option A), it's less critical but doesn't hurt.
-- Consider if existing messages should be backfilled or only new messages get priority.
-- If backfilling, you'd run a script to process old messages.
