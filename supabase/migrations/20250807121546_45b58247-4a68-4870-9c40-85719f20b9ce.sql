-- Drop all advertiser-related tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS campaign_performance CASCADE;
DROP TABLE IF EXISTS moderation_queue CASCADE;
DROP TABLE IF EXISTS ad_cards CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS advertiser_profiles CASCADE;