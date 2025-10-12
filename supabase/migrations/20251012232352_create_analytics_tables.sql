/*
  # Analytics and User Tracking Schema

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text) - GitHub user ID
      - `username` (text) - GitHub username
      - `session_start` (timestamptz) - Session start time
      - `session_end` (timestamptz) - Session end time
      - `last_activity` (timestamptz) - Last activity timestamp
      - `created_at` (timestamptz) - Record creation time
    
    - `achievement_workflows`
      - `id` (uuid, primary key)
      - `user_id` (text) - GitHub user ID
      - `achievement_type` (text) - Type of achievement (pull_shark, quickdraw, etc.)
      - `status` (text) - Status (pending, in_progress, completed, failed)
      - `repository_url` (text) - URL of created repository
      - `pull_request_url` (text) - URL of pull request
      - `auto_deleted` (boolean) - Whether repo was auto-deleted
      - `duration_ms` (integer) - Time taken to complete workflow
      - `error_message` (text) - Error details if failed
      - `started_at` (timestamptz) - Workflow start time
      - `completed_at` (timestamptz) - Workflow completion time
      - `created_at` (timestamptz) - Record creation time
    
    - `user_actions`
      - `id` (uuid, primary key)
      - `user_id` (text) - GitHub user ID
      - `action_type` (text) - Type of action (page_view, button_click, setting_change, etc.)
      - `action_data` (jsonb) - Additional action metadata
      - `page_url` (text) - Current page URL
      - `created_at` (timestamptz) - When action occurred
    
    - `user_feedback`
      - `id` (uuid, primary key)
      - `user_id` (text) - GitHub user ID
      - `feedback_type` (text) - Type (bug, feature_request, general)
      - `rating` (integer) - Rating 1-5
      - `message` (text) - Feedback message
      - `contact_email` (text) - Optional contact email
      - `created_at` (timestamptz) - Submission time

  2. Security
    - Enable RLS on all tables
    - Users can read/write their own data only
    - Admins can read all data (optional for analytics dashboard)
*/

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  username text NOT NULL,
  session_start timestamptz NOT NULL DEFAULT now(),
  session_end timestamptz,
  last_activity timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert own sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own sessions"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- Achievement Workflows Table
CREATE TABLE IF NOT EXISTS achievement_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  achievement_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  repository_url text,
  pull_request_url text,
  auto_deleted boolean DEFAULT false,
  duration_ms integer,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_achievement_workflows_user_id ON achievement_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_workflows_type ON achievement_workflows(achievement_type);
CREATE INDEX IF NOT EXISTS idx_achievement_workflows_status ON achievement_workflows(status);
CREATE INDEX IF NOT EXISTS idx_achievement_workflows_created_at ON achievement_workflows(created_at DESC);

ALTER TABLE achievement_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workflows"
  ON achievement_workflows FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert own workflows"
  ON achievement_workflows FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own workflows"
  ON achievement_workflows FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- User Actions Table
CREATE TABLE IF NOT EXISTS user_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  action_type text NOT NULL,
  action_data jsonb DEFAULT '{}'::jsonb,
  page_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON user_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_data ON user_actions USING gin(action_data);

ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own actions"
  ON user_actions FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert own actions"
  ON user_actions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  feedback_type text NOT NULL DEFAULT 'general',
  rating integer CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  contact_email text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert own feedback"
  ON user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');
