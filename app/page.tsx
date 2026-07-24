'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Shield, Dog, Terminal, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { TokenInput } from '@/components/token-input';
import { AchievementCard, type AchievementStatus } from '@/components/achievement-card';
import { ActivityLog } from '@/components/activity-log';
import { SettingsPanel } from '@/components/settings-panel';
import { AchievementHistory } from '@/components/achievement-history';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storageUtils, type AchievementRecord, type LogEntry } from '@/lib/storage';
import { toast } from 'sonner';

type AchievementType = 'pull_shark' | 'quickdraw' | 'yolo';

interface AchievementState {
  status: AchievementStatus;
  progress: number;
}

const ACHIEVEMENT_META: Record<AchievementType, { endpoint: string }> = {
  pull_shark: { endpoint: 'pull-shark' },
  quickdraw: { endpoint: 'quickdraw' },
  yolo: { endpoint: 'yolo' },
};

export default function Home() {
  const { data: session, status } = useSession();
  const [autoDeleteRepos, setAutoDeleteRepos] = React.useState(false);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [history, setHistory] = React.useState<AchievementRecord[]>([]);
  const [achievements, setAchievements] = React.useState<Record<AchievementType, AchievementState>>({
    pull_shark: { status: 'idle', progress: 0 },
    quickdraw: { status: 'idle', progress: 0 },
    yolo: { status: 'idle', progress: 0 },
  });

  const addLog = React.useCallback((level: 'info' | 'success' | 'warning' | 'error', message: string, details?: unknown) => {
    storageUtils.addLog({ level, message, details: details as any });
    setLogs(storageUtils.getLogs());
  }, []);

  React.useEffect(() => {
    const prefs = storageUtils.getPreferences();
    setAutoDeleteRepos(prefs.autoDeleteRepos);
    setLogs(storageUtils.getLogs());
    setHistory(storageUtils.getAchievementHistory());
  }, []);

  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      addLog('success', `Connected as ${session.user.name || session.user.email}`);
    }
  }, [status, session, addLog]);

  const handleAutoDeleteChange = (value: boolean) => {
    setAutoDeleteRepos(value);
    const prefs = storageUtils.getPreferences();
    prefs.autoDeleteRepos = value;
    storageUtils.setPreferences(prefs);
    toast.success('Settings updated', {
      description: value ? 'Will clean up after fetching' : 'Will keep fetched repositories',
    });
  };

  const handleUnlockAchievement = async (type: AchievementType) => {
    if (status !== 'authenticated') {
      toast.error('Not authenticated', {
        description: 'Please sign in with GitHub first',
      });
      return;
    }

    setAchievements(prev => ({
      ...prev,
      [type]: { status: 'in_progress', progress: 0 },
    }));

    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      setAchievements(prev => {
        const current = prev[type].progress;
        if (current >= 95) return prev;
        return {
          ...prev,
          [type]: { ...prev[type], progress: Math.min(current + 5, 95) },
        };
      });
    }, 1000);

    try {
      const endpoint = `/api/achievements/${ACHIEVEMENT_META[type].endpoint}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoName: `repo-${type}-${Date.now()}`,
          commitMessage: 'Update repository',
          prTitle: 'Automated update',
          autoDelete: autoDeleteRepos,
        }),
      });

      const result = await response.json();

      clearInterval(progressInterval);

      if (response.ok && result.success) {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

        setAchievements(prev => ({
          ...prev,
          [type]: { status: 'success', progress: 100 },
        }));

        const record: AchievementRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          achievementType: type,
          status: 'success',
          repositoryUrl: result.repository,
          pullRequestUrls: result.pullRequest ? [result.pullRequest] : undefined,
          issueUrl: result.issue,
          durationSeconds,
          createdAt: new Date().toISOString(),
        };

        storageUtils.addAchievementRecord(record);
        setHistory(storageUtils.getAchievementHistory());

        addLog('success', `${type} achievement fetched successfully`, result);

        toast.success('Achievement fetched!', {
          description: `RepoRetriever brought it back in ${durationSeconds}s`,
        });

        setTimeout(() => {
          setAchievements(prev => ({
            ...prev,
            [type]: { status: 'idle', progress: 0 },
          }));
        }, 3000);
      } else {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

        setAchievements(prev => ({
          ...prev,
          [type]: { status: 'error', progress: 0 },
        }));

        const errorMessage = result.message || result.error || 'Unknown error';

        const record: AchievementRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          achievementType: type,
          status: 'failed',
          errorMessage,
          durationSeconds,
          createdAt: new Date().toISOString(),
        };

        storageUtils.addAchievementRecord(record);
        setHistory(storageUtils.getAchievementHistory());

        addLog('error', `Achievement fetch failed: ${errorMessage}`);

        toast.error('Fetch failed', {
          description: errorMessage,
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      setAchievements(prev => ({
        ...prev,
        [type]: { status: 'error', progress: 0 },
      }));

      addLog('error', `Achievement automation failed: ${errorMessage}`);
      toast.error('Error', {
        description: errorMessage,
      });
    }
  };

  const handleClearHistory = () => {
    storageUtils.clearAchievementHistory();
    setHistory([]);
    toast.success('History cleared', {
      description: 'All fetch records have been removed',
    });
  };

  const handleClearLogs = () => {
    storageUtils.clearLogs();
    setLogs([]);
    toast.success('Logs cleared', {
      description: 'All activity logs have been removed',
    });
  };

  const handleExportData = () => {
    const data = storageUtils.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-achievements-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported', {
      description: 'RepoRetriever packaged your data for download',
    });
  };

  const isConnected = status === 'authenticated';

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl neu-pill">
              <Dog className="h-6 w-6 text-primary glow-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight glow-primary">RepoRetriever</h1>
              <p className="text-xs text-muted-foreground">GitHub achievement companion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="hidden sm:flex items-center gap-2 neu-pill px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {!isConnected ? (
            <>
              <section className="text-center space-y-6 pt-8 pb-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 neu-pill px-4 py-2 rounded-full">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Automated GitHub achievement fetcher</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Teach your GitHub profile
                  <br />
                  <span className="glow-primary text-primary">new tricks</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  RepoRetriever fetches GitHub achievements by performing the real API actions
                  that trigger them. Sign in, pick an achievement, and watch it work.
                </p>
              </section>

              <TokenInput />

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="neu-surface rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="h-5 w-5" />
                    <h3 className="font-semibold">One-Click Fetch</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Each achievement triggers the exact sequence of GitHub API calls needed to unlock it.
                  </p>
                </div>
                <div className="neu-surface rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    <h3 className="font-semibold">Server-Side Security</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your GitHub token stays on the server in encrypted HttpOnly cookies. Never exposed to the browser.
                  </p>
                </div>
                <div className="neu-surface rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Dog className="h-5 w-5" />
                    <h3 className="font-semibold">Auto Cleanup</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optional automatic repository deletion keeps your GitHub profile tidy after each fetch.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              <Alert className="neu-surface-flat border-0">
                <Shield className="h-4 w-4 text-accent" />
                <AlertDescription className="text-muted-foreground">
                  <span className="text-foreground font-medium">Secure connection active.</span>{' '}
                  Your GitHub token is encrypted server-side. RepoRetriever performs real API actions
                  to trigger achievement unlocks.
                </AlertDescription>
              </Alert>

              <TokenInput />

              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Terminal className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold tracking-tight">Achievements to Fetch</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AchievementCard
                    title="Pull Shark"
                    description="Create and merge 2 pull requests"
                    emoji="🦈"
                    status={achievements.pull_shark.status}
                    progress={achievements.pull_shark.progress}
                    onUnlock={() => handleUnlockAchievement('pull_shark')}
                    disabled={!isConnected}
                    estimatedTime="~20-30s"
                    requirements="2 PRs"
                  />
                  <AchievementCard
                    title="Quickdraw"
                    description="Create and close an issue rapidly"
                    emoji="⚡"
                    status={achievements.quickdraw.status}
                    progress={achievements.quickdraw.progress}
                    onUnlock={() => handleUnlockAchievement('quickdraw')}
                    disabled={!isConnected}
                    estimatedTime="~5-10s"
                    requirements="1 issue"
                  />
                  <AchievementCard
                    title="YOLO"
                    description="Push direct commits to main branch"
                    emoji="🎯"
                    status={achievements.yolo.status}
                    progress={achievements.yolo.progress}
                    onUnlock={() => handleUnlockAchievement('yolo')}
                    disabled={!isConnected}
                    estimatedTime="~10-15s"
                    requirements="2 commits"
                  />
                </div>
              </section>

              <section>
                <Tabs defaultValue="log" className="w-full">
                  <TabsList className="neu-inset border-0">
                    <TabsTrigger value="log" className="data-[state=active]:text-primary">
                      <Terminal className="h-4 w-4 mr-2" />
                      Activity Log
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:text-primary">
                      <Dog className="h-4 w-4 mr-2" />
                      Fetch History
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:text-primary">
                      <Shield className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="log" className="mt-4">
                    <ActivityLog logs={logs} onClear={handleClearLogs} />
                  </TabsContent>
                  <TabsContent value="history" className="mt-4">
                    <AchievementHistory history={history} />
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <SettingsPanel
                      autoDeleteRepos={autoDeleteRepos}
                      onAutoDeleteChange={handleAutoDeleteChange}
                      onClearHistory={handleClearHistory}
                      onClearLogs={handleClearLogs}
                      onExportData={handleExportData}
                      historyCount={history.length}
                      logCount={logs.length}
                    />
                  </TabsContent>
                </Tabs>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Dog className="h-4 w-4 text-primary" />
              RepoRetriever — A loyal companion for GitHub achievements
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub API Docs
              </a>
              <Separator orientation="vertical" className="h-4" />
              <a
                href="https://github.com/settings/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Manage OAuth Apps
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
