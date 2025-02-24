/*
  # Create assistants table

  1. New Tables
    - `assistants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `assistant_id` (text, from Vapi API)
      - `name` (text)
      - `first_message` (text)
      - `system_prompt` (text)
      - `language` (text)
      - `voice_id` (text)
      - `temperature` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `assistants` table
    - Add policies for authenticated users to manage their own assistants
*/

CREATE TABLE IF NOT EXISTS assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  assistant_id text NOT NULL,
  name text NOT NULL,
  first_message text NOT NULL,
  system_prompt text NOT NULL,
  language text NOT NULL,
  voice_id text NOT NULL,
  temperature numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own assistants"
  ON assistants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assistants"
  ON assistants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assistants"
  ON assistants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assistants"
  ON assistants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);