-- Sample seed data for AutoTrack demo
-- Replace 'YOUR_USER_ID_HERE' with an actual user UUID from your Supabase auth.users table

-- Example transactions for demo purposes
-- To use this file:
-- 1. Create a user account in your application
-- 2. Get the user's UUID from the Supabase dashboard (Authentication > Users)
-- 3. Replace 'YOUR_USER_ID_HERE' with the actual UUID
-- 4. Run this SQL in the Supabase SQL Editor

INSERT INTO transactions (user_id, vendor, category, amount, date, description) VALUES
-- October 2024
('YOUR_USER_ID_HERE', 'Starbucks', 'Food & Dining', 5.75, '2024-10-01', 'Morning coffee'),
('YOUR_USER_ID_HERE', 'Uber', 'Transportation', 15.50, '2024-10-02', 'Ride to office'),
('YOUR_USER_ID_HERE', 'Amazon', 'Shopping', 49.99, '2024-10-03', 'Office supplies'),
('YOUR_USER_ID_HERE', 'Whole Foods', 'Food & Dining', 87.32, '2024-10-05', 'Weekly groceries'),
('YOUR_USER_ID_HERE', 'Shell Gas Station', 'Transportation', 45.00, '2024-10-07', 'Gas fill-up'),
('YOUR_USER_ID_HERE', 'Netflix', 'Entertainment', 15.99, '2024-10-10', 'Monthly subscription'),
('YOUR_USER_ID_HERE', 'PG&E', 'Utilities', 125.00, '2024-10-12', 'Electricity bill'),
('YOUR_USER_ID_HERE', 'Chipotle', 'Food & Dining', 12.50, '2024-10-14', 'Lunch'),
('YOUR_USER_ID_HERE', 'Target', 'Shopping', 78.25, '2024-10-15', 'Household items'),
('YOUR_USER_ID_HERE', 'CVS Pharmacy', 'Healthcare', 23.99, '2024-10-16', 'Medications'),
('YOUR_USER_ID_HERE', 'Starbucks', 'Food & Dining', 6.25, '2024-10-18', 'Afternoon coffee'),
('YOUR_USER_ID_HERE', 'Lyft', 'Transportation', 18.75, '2024-10-19', 'Ride home'),
('YOUR_USER_ID_HERE', 'AT&T', 'Utilities', 85.00, '2024-10-20', 'Phone bill'),
('YOUR_USER_ID_HERE', 'Olive Garden', 'Food & Dining', 45.80, '2024-10-21', 'Dinner with friends'),
('YOUR_USER_ID_HERE', 'AMC Theatres', 'Entertainment', 28.00, '2024-10-22', 'Movie tickets'),

-- September 2024
('YOUR_USER_ID_HERE', 'Trader Joes', 'Food & Dining', 65.40, '2024-09-05', 'Weekly groceries'),
('YOUR_USER_ID_HERE', 'Starbucks', 'Food & Dining', 5.50, '2024-09-08', 'Coffee'),
('YOUR_USER_ID_HERE', 'Uber', 'Transportation', 22.30, '2024-09-10', 'Airport ride'),
('YOUR_USER_ID_HERE', 'Delta Airlines', 'Travel', 350.00, '2024-09-12', 'Flight to NYC'),
('YOUR_USER_ID_HERE', 'Marriott Hotel', 'Travel', 450.00, '2024-09-13', 'Hotel stay - 2 nights'),
('YOUR_USER_ID_HERE', 'Amazon', 'Shopping', 125.99, '2024-09-15', 'Electronics'),
('YOUR_USER_ID_HERE', 'Spotify', 'Entertainment', 9.99, '2024-09-16', 'Music subscription'),
('YOUR_USER_ID_HERE', 'Whole Foods', 'Food & Dining', 92.15, '2024-09-18', 'Groceries'),
('YOUR_USER_ID_HERE', 'Shell Gas Station', 'Transportation', 48.00, '2024-09-20', 'Gas'),
('YOUR_USER_ID_HERE', 'Dentist Office', 'Healthcare', 150.00, '2024-09-22', 'Dental cleaning'),

-- August 2024
('YOUR_USER_ID_HERE', 'Safeway', 'Food & Dining', 78.90, '2024-08-03', 'Weekly groceries'),
('YOUR_USER_ID_HERE', 'Starbucks', 'Food & Dining', 5.75, '2024-08-05', 'Coffee'),
('YOUR_USER_ID_HERE', 'Best Buy', 'Shopping', 299.99, '2024-08-08', 'Laptop accessories'),
('YOUR_USER_ID_HERE', 'Uber Eats', 'Food & Dining', 32.50, '2024-08-10', 'Dinner delivery'),
('YOUR_USER_ID_HERE', 'Comcast', 'Utilities', 95.00, '2024-08-12', 'Internet bill'),
('YOUR_USER_ID_HERE', 'Target', 'Shopping', 67.45, '2024-08-15', 'Home goods'),
('YOUR_USER_ID_HERE', 'Chevron', 'Transportation', 52.00, '2024-08-18', 'Gas'),
('YOUR_USER_ID_HERE', 'Panera Bread', 'Food & Dining', 15.25, '2024-08-20', 'Lunch'),
('YOUR_USER_ID_HERE', 'AMC Theatres', 'Entertainment', 24.00, '2024-08-22', 'Movie night'),
('YOUR_USER_ID_HERE', 'Amazon', 'Shopping', 45.00, '2024-08-25', 'Books');

-- To verify the seed data was inserted:
-- SELECT COUNT(*) FROM transactions WHERE user_id = 'YOUR_USER_ID_HERE';
