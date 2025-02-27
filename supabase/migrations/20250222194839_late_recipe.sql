/*
  # Update demo requests RLS policy

  1. Changes
    - Allow public access for inserting demo requests
    - Remove authentication requirement for demo request submissions
    
  2. Security
    - Enable RLS on demo_requests table
    - Allow anonymous users to insert demo requests
    - Restrict read access to authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can insert demo requests" ON demo_requests;
DROP POLICY IF EXISTS "Users can read their own demo requests" ON demo_requests;

-- Create new policies
CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (true);