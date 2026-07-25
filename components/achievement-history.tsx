'use client';

import * as React from 'react';
import { History, ExternalLink, Clock, CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AchievementRecord } from '@/lib/storage';

interface AchievementHistoryProps {
  history: AchievementRecord[];
}

const achievementEmojis = {
  pull_shark: '🦈',
  quickdraw: '⚡',
  yolo: '🎯',
};

const achievementNames = {
  pull_shark: 'Pull Shark',
  quickdraw: 'Quickdraw',
  yolo: 'YOLO',
};

export function AchievementHistory({ history }: AchievementHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const successCount = history.filter(h => h.status === 'success').length;
  const failedCount = history.filter(h => h.status === 'failed').length;

  return (
    <Card className="neu-surface border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" aria-hidden="true" />
          Fetch History
        </CardTitle>
        <CardDescription>
          {history.length === 0
            ? "RepoRetriever's fetch history will appear here"
            : `${successCount} successful fetches, ${failedCount} failed`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="text-4xl opacity-40" aria-hidden="true">{'>'}_</div>
                <p>No fetches yet. Send RepoRetriever to work above!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className={`p-4 rounded-lg neu-inset transition-all ${
                    record.status === 'success'
                      ? 'glow-ring-accent'
                      : 'glow-ring-destructive'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl mt-1" aria-hidden="true">
                        {achievementEmojis[record.achievementType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">
                            {achievementNames[record.achievementType]}
                          </h4>
                          <Badge
                            variant={record.status === 'success' ? 'default' : 'destructive'}
                            className="flex items-center gap-1 neu-pill border-0"
                          >
                            {record.status === 'success' ? (
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <XCircle className="h-3 w-3" aria-hidden="true" />
                            )}
                            {record.status}
                            <span className="sr-only">Outcome: {record.status}</span>
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span>{formatDate(record.createdAt)}</span>
                            <span aria-hidden="true">•</span>
                            <span>{formatDuration(record.durationSeconds)}</span>
                          </div>

                          {record.repositoryUrl && (
                            <a
                              href={record.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                              aria-label={`View repository for ${achievementNames[record.achievementType]} (opens in new tab)`}
                            >
                              View Repository
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}

                          {record.issueUrl && (
                            <a
                              href={record.issueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline ml-4"
                              aria-label={`View issue for ${achievementNames[record.achievementType]} (opens in new tab)`}
                            >
                              View Issue
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          )}

                          {record.pullRequestUrls && record.pullRequestUrls.length > 0 && (
                            <div className="space-y-1">
                              {record.pullRequestUrls.map((url, index) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline mr-4"
                                  aria-label={`View pull request ${index + 1} (opens in new tab)`}
                                >
                                  PR #{index + 1}
                                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                </a>
                              ))}
                            </div>
                          )}

                          {record.errorMessage && (
                            <p className="text-destructive text-xs mt-2 font-mono">
                              Error: {record.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
