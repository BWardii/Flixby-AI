/*
  # Add Call Logs Table

  1. New Tables
    - `call_logs`
      - `id` (uuid, primary key)
      - `call_id` (text, not null)
      - `assistant_id` (text, not null)
      - `start_time` (timestamptz, not null)
      - `end_time` (timestamptz, not null)
      - `duration_seconds` (integer, not null)
      - `status` (text, check constraint: completed/failed/interrupted)
      - `error_message` (text)
      - `transcript` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `call_logs` table
    - Add policies for authenticated users to:
      - Insert their own call logs
      - View their own call logs
*/

CREATE TABLE IF NOT EXISTS call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id text NOT NULL,
  assistant_id text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration_seconds integer NOT NULL,
  status text NOT NULL CHECK (status IN ('completed', 'failed', 'interrupted')),
  error_message text,
  transcript text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own call logs"
  ON call_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assistants
      WHERE assistant_id = call_logs.assistant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own call logs"
  ON call_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assistants
      WHERE assistant_id = call_logs.assistant_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_call_logs_assistant_id ON call_logs(assistant_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);