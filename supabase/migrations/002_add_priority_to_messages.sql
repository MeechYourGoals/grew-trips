-- Migration 002: Add priority column to messages
-- Run after 001_audio_summaries.sql

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
