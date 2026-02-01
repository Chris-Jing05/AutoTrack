-- AutoTrack Database Schema for Supabase PostgreSQL
-- This file contains the SQL commands to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only see their own transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own transactions
CREATE POLICY "Users can update their own transactions"
    ON transactions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own transactions
CREATE POLICY "Users can delete their own transactions"
    ON transactions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a view for monthly summaries (optional, for analytics)
CREATE OR REPLACE VIEW monthly_spending AS
SELECT
    user_id,
    DATE_TRUNC('month', date) AS month,
    category,
    SUM(amount) AS total_amount,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date), category
ORDER BY month DESC, total_amount DESC;

-- Grant access to authenticated users
GRANT SELECT ON monthly_spending TO authenticated;

-- Comments for documentation
COMMENT ON TABLE transactions IS 'Stores user expense transactions';
COMMENT ON COLUMN transactions.id IS 'Unique identifier for the transaction';
COMMENT ON COLUMN transactions.user_id IS 'Reference to the user who owns this transaction';
COMMENT ON COLUMN transactions.vendor IS 'Name of the vendor/merchant';
COMMENT ON COLUMN transactions.category IS 'Expense category (e.g., Food & Dining, Transportation)';
COMMENT ON COLUMN transactions.amount IS 'Transaction amount in USD';
COMMENT ON COLUMN transactions.date IS 'Date of the transaction';
COMMENT ON COLUMN transactions.description IS 'Additional notes or description';
COMMENT ON COLUMN transactions.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN transactions.updated_at IS 'Timestamp when the record was last updated';
