/*
  # Create checkpoint for assistants table

  1. Changes
    - Add checkpoint column to assistants table
    - Add checkpoint_at timestamp
    - Add checkpoint_data JSONB for storing checkpoint state
    - Add checkpoint_status for tracking status

  2. Security
    - Maintain existing RLS policies
*/

-- Add checkpoint columns
ALTER TABLE assistants 
ADD COLUMN IF NOT EXISTS checkpoint_at timestamptz,
ADD COLUMN IF NOT EXISTS checkpoint_data jsonb,
ADD COLUMN IF NOT EXISTS checkpoint_status text CHECK (checkpoint_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending';

-- Create index for faster checkpoint queries
CREATE INDEX IF NOT EXISTS idx_assistants_checkpoint_status ON assistants(checkpoint_status);

-- Update RLS policies to include checkpoint data
CREATE POLICY "Users can view their own assistant checkpoints"
  ON assistants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assistant checkpoints"
  ON assistants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);