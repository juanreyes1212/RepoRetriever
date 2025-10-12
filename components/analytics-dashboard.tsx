'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsService } from '@/lib/analytics';

interface AnalyticsDashboardProps {
  userId: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [stats, setStats] = React.useState<any>(null);
  const [workflows, setWorkflows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      const [statsData, workflowsData] = await Promise.all([
        AnalyticsService.getUserStats(userId),
        AnalyticsService.getUserWorkflows(userId, 10),
      ]);
      setStats(statsData);
      setWorkflows(workflowsData);
      setLoading(false);
    }

    if (userId) {
      loadAnalytics();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading analytics...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const successRate = stats.total_workflows > 0
    ? Math.round((stats.completed / stats.total_workflows) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
          <CardDescription>Your workflow statistics and performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Activity className="h-4 w-4" />
                Total Workflows
              </div>
              <p className="text-2xl font-bold">{stats.total_workflows}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Completed
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <XCircle className="h-4 w-4 text-red-500" />
                Failed
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Success Rate
              </div>
              <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Workflows by Achievement Type</h4>
            <div className="space-y-2">
              {Object.entries(stats.by_type).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          {workflows.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Workflows</h4>
              <div className="space-y-2">
                {workflows.slice(0, 5).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize">
                        {workflow.achievement_type.replace('_', ' ')}
                      </span>
                      {workflow.status === 'completed' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {workflow.status === 'failed' && (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
