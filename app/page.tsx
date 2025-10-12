'use client';

import * as React from 'react';
import { Github, Shield, Zap, Award, Dog } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { TokenInput } from '@/components/token-input';
import { AchievementCard, type AchievementStatus } from '@/components/achievement-card';
import { ActivityLog } from '@/components/activity-log';
import { SettingsPanel } from '@/components/settings-panel';
import { AchievementHistory } from '@/components/achievement-history';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { storageUtils, type AchievementRecord, type LogEntry } from '@/lib/storage';
import { GitHubAPI, type GitHubUser } from '@/lib/github-api';
import { AchievementAutomator } from '@/lib/achievement-automator';
import { toast } from 'sonner';

type AchievementType = 'pull_shark' | 'quickdraw' | 'yolo';

interface AchievementState {
  status: AchievementStatus;
  progress: number;
}

export default function Home() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [user, setUser] = React.useState<GitHubUser | null>(null);
  const [error, setError] = React.useState<string>('');
  const [autoDeleteRepos, setAutoDeleteRepos] = React.useState(false);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [history, setHistory] = React.useState<AchievementRecord[]>([]);
  const [achievements, setAchievements] = React.useState<Record<AchievementType, AchievementState>>({
    pull_shark: { status: 'idle', progress: 0 },
    quickdraw: { status: 'idle', progress: 0 },
    yolo: { status: 'idle', progress: 0 },
  });

  React.useEffect(() => {
    const token = storageUtils.getToken();
    if (token) {
      validateAndConnect(token);
    }

    const prefs = storageUtils.getPreferences();
    setAutoDeleteRepos(prefs.autoDeleteRepos);

    setLogs(storageUtils.getLogs());
    setHistory(storageUtils.getAchievementHistory());
  }, []);

  const addLog = (level: 'info' | 'success' | 'warning' | 'error', message: string, details?: any) => {
    storageUtils.addLog({ level, message, details });
    setLogs(storageUtils.getLogs());
  };

  const validateAndConnect = async (token: string) => {
    setIsValidating(true);
    setError('');

    try {
      const api = new GitHubAPI(token);
      const userData = await api.validateToken();

      const scopes = await api.checkTokenScopes();
      const hasRepoScope = scopes.some(s => s === 'repo' || s.includes('repo'));
      const hasDeleteScope = scopes.some(s => s === 'delete_repo');

      if (!hasRepoScope) {
        throw new Error('Token missing required "repo" scope');
      }

      if (!hasDeleteScope) {
        addLog('warning', 'Token missing "delete_repo" scope - repository cleanup will not be available');
        toast.warning('Missing delete_repo scope', {
          description: 'Repository cleanup will not be available',
        });
      }

      storageUtils.setToken(token);
      setUser(userData);
      setIsConnected(true);
      addLog('success', `Connected as ${userData.login}`);
      toast.success('RepoRetriever connected!', {
        description: `Ready to fetch achievements for ${userData.login}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate token';
      setError(errorMessage);
      addLog('error', `Connection failed: ${errorMessage}`);
      toast.error('Connection failed', {
        description: errorMessage,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDisconnect = () => {
    storageUtils.clearToken();
    setIsConnected(false);
    setUser(null);
    setAchievements({
      pull_shark: { status: 'idle', progress: 0 },
      quickdraw: { status: 'idle', progress: 0 },
      yolo: { status: 'idle', progress: 0 },
    });
    addLog('info', 'Disconnected from GitHub');
    toast.info('RepoRetriever disconnected', {
      description: 'Sitting down and waiting for next command',
    });
  };

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
    const token = storageUtils.getToken();
    if (!token || !user) return;

    setAchievements(prev => ({
      ...prev,
      [type]: { status: 'in_progress', progress: 0 },
    }));

    const automator = new AchievementAutomator(token, user.login, addLog);
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
      let result;

      switch (type) {
        case 'yolo':
          result = await automator.automateYOLO(autoDeleteRepos);
          break;
        case 'quickdraw':
          result = await automator.automateQuickdraw(autoDeleteRepos);
          break;
        case 'pull_shark':
          result = await automator.automatePullShark(autoDeleteRepos);
          break;
      }

      clearInterval(progressInterval);

      if (result.success) {
        setAchievements(prev => ({
          ...prev,
          [type]: { status: 'success', progress: 100 },
        }));

        const record: AchievementRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          achievementType: type,
          status: 'success',
          repositoryUrl: result.repositoryUrl,
          issueUrl: result.issueUrl,
          pullRequestUrls: result.pullRequestUrls,
          durationSeconds: result.durationSeconds,
          createdAt: new Date().toISOString(),
        };

        storageUtils.addAchievementRecord(record);
        setHistory(storageUtils.getAchievementHistory());

        toast.success('Achievement fetched!', {
          description: `RepoRetriever brought it back in ${result.durationSeconds}s`,
        });

        setTimeout(() => {
          setAchievements(prev => ({
            ...prev,
            [type]: { status: 'idle', progress: 0 },
          }));
        }, 3000);
      } else {
        setAchievements(prev => ({
          ...prev,
          [type]: { status: 'error', progress: 0 },
        }));

        const record: AchievementRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          achievementType: type,
          status: 'failed',
          errorMessage: result.error,
          durationSeconds: result.durationSeconds,
          createdAt: new Date().toISOString(),
        };

        storageUtils.addAchievementRecord(record);
        setHistory(storageUtils.getAchievementHistory());

        toast.error('Fetch failed', {
          description: result.error,
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b clay-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 clay-badge">
              <Dog className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RepoRetriever</h1>
              <p className="text-sm text-muted-foreground">Your loyal GitHub achievement companion</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Alert className="clay-card border-0">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Good Boy Guarantee:</strong> Your GitHub token stays in this browser tab only. RepoRetriever fetches achievements directly from GitHub's API without any intermediary servers.
            </AlertDescription>
          </Alert>

          <TokenInput
            onConnect={validateAndConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            username={user?.login}
            avatarUrl={user?.avatar_url}
            isValidating={isValidating}
            error={error}
          />

          {isConnected && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Dog className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Achievements to Fetch</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AchievementCard
                    title="Pull Shark"
                    description="Fetch & merge 2 pull requests"
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
                    description="Fetch & close issue in under 5 minutes"
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
                    description="Fetch direct commits to main"
                    emoji="🎯"
                    status={achievements.yolo.status}
                    progress={achievements.yolo.progress}
                    onUnlock={() => handleUnlockAchievement('yolo')}
                    disabled={!isConnected}
                    estimatedTime="~10-15s"
                    requirements="2 commits"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityLog logs={logs} onClear={handleClearLogs} />
                <div className="space-y-6">
                  <SettingsPanel
                    autoDeleteRepos={autoDeleteRepos}
                    onAutoDeleteChange={handleAutoDeleteChange}
                    onClearHistory={handleClearHistory}
                    onClearLogs={handleClearLogs}
                    onExportData={handleExportData}
                    historyCount={history.length}
                    logCount={logs.length}
                  />
                </div>
              </div>

              <AchievementHistory history={history} />
            </>
          )}
        </div>
      </main>

      <footer className="border-t mt-16 clay-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Dog className="h-4 w-4" />
              RepoRetriever - A loyal companion for GitHub achievements
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
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Manage Tokens
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
