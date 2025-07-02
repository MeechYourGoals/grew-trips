-- Migration 003: Create daily_digests table
-- Run after 002_add_priority_to_messages.sql

CREATE TABLE IF NOT EXISTS daily_digests (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  digest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
