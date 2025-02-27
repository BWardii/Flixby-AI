/*
  # Create demo requests table

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `company` (text)
      - `message` (text)
      - `newsletter` (boolean)
      - `created_at` (timestamp)
      - `status` (text) - For tracking request status (new, contacted, etc.)

  2. Security
    - Enable RLS on `demo_requests` table
    - Add policy for authenticated users to read their own data
    - Add policy for service role to insert new requests
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  message text NOT NULL,
  newsletter boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert demo requests"
  ON demo_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (email = auth.email());