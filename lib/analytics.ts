import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserSession {
  id?: string;
  user_id: string;
  username: string;
  session_start: string;
  session_end?: string;
  last_activity: string;
}

export interface AchievementWorkflow {
  id?: string;
  user_id: string;
  achievement_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  repository_url?: string;
  pull_request_url?: string;
  auto_deleted?: boolean;
  duration_ms?: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface UserAction {
  id?: string;
  user_id: string;
  action_type: string;
  action_data?: Record<string, any>;
  page_url?: string;
  created_at?: string;
}

export interface UserFeedback {
  id?: string;
  user_id: string;
  feedback_type: 'bug' | 'feature_request' | 'general';
  rating?: number;
  message: string;
  contact_email?: string;
  created_at?: string;
}

export class AnalyticsService {
  static async startSession(userId: string, username: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          username,
          session_start: new Date().toISOString(),
          last_activity: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Failed to start session:', error);
      return null;
    }
  }

  static async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  static async endSession(sessionId: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ session_end: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  static async trackWorkflowStart(
    userId: string,
    achievementType: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('achievement_workflows')
        .insert({
          user_id: userId,
          achievement_type: achievementType,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Failed to track workflow start:', error);
      return null;
    }
  }

  static async trackWorkflowComplete(
    workflowId: string,
    data: {
      status: 'completed' | 'failed';
      repository_url?: string;
      pull_request_url?: string;
      auto_deleted?: boolean;
      duration_ms?: number;
      error_message?: string;
    }
  ): Promise<void> {
    try {
      await supabase
        .from('achievement_workflows')
        .update({
          ...data,
          completed_at: new Date().toISOString(),
        })
        .eq('id', workflowId);
    } catch (error) {
      console.error('Failed to track workflow completion:', error);
    }
  }

  static async trackAction(
    userId: string,
    actionType: string,
    actionData?: Record<string, any>,
    pageUrl?: string
  ): Promise<void> {
    try {
      await supabase.from('user_actions').insert({
        user_id: userId,
        action_type: actionType,
        action_data: actionData || {},
        page_url: pageUrl || window.location.pathname,
      });
    } catch (error) {
      console.error('Failed to track action:', error);
    }
  }

  static async submitFeedback(feedback: Omit<UserFeedback, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase.from('user_feedback').insert(feedback);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      return false;
    }
  }

  static async getUserWorkflows(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('achievement_workflows')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get user workflows:', error);
      return [];
    }
  }

  static async getUserStats(userId: string) {
    try {
      const { data: workflows, error: workflowError } = await supabase
        .from('achievement_workflows')
        .select('achievement_type, status')
        .eq('user_id', userId);

      if (workflowError) throw workflowError;

      const stats = {
        total_workflows: workflows?.length || 0,
        completed: workflows?.filter((w) => w.status === 'completed').length || 0,
        failed: workflows?.filter((w) => w.status === 'failed').length || 0,
        in_progress: workflows?.filter((w) => w.status === 'in_progress').length || 0,
        by_type: {} as Record<string, number>,
      };

      workflows?.forEach((w) => {
        stats.by_type[w.achievement_type] = (stats.by_type[w.achievement_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }
}
