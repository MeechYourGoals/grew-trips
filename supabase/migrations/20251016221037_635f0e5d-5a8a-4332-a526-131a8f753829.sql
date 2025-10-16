-- Add indexes for payment balance calculations
CREATE INDEX IF NOT EXISTS idx_payment_splits_debtor_settled 
ON payment_splits(debtor_user_id, is_settled);

CREATE INDEX IF NOT EXISTS idx_trip_payment_messages_trip_creator 
ON trip_payment_messages(trip_id, created_by);

COMMENT ON INDEX idx_payment_splits_debtor_settled IS 'Optimize balance queries by debtor and settlement status';
COMMENT ON INDEX idx_trip_payment_messages_trip_creator IS 'Optimize payment queries by trip and creator';