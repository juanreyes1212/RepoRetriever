'use client';

import * as React from 'react';
import { CircleCheck as CheckCircle2, Info, TriangleAlert as AlertTriangle, Circle as XCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LogEntry } from '@/lib/storage';

interface ActivityLogProps {
  logs: LogEntry[];
  onClear?: () => void;
}

const levelConfig = {
  info: {
    icon: Info,
    color: 'text-primary',
    bgColor: 'neu-inset',
    label: 'Info',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'neu-inset',
    label: 'Success',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'neu-inset',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'neu-inset',
    label: 'Error',
  },
};

export function ActivityLog({ logs, onClear }: ActivityLogProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const extractUrl = (message: string): string | null => {
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : null;
  };

  return (
    <Card className="neu-surface border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="glow-primary text-primary">{'>'}</span>
              Fetch Log
            </CardTitle>
            <CardDescription>Watch RepoRetriever work in real-time</CardDescription>
          </div>
          {logs.length > 0 && onClear && (
            <Button variant="ghost" size="sm" onClick={onClear} className="neu-button">
              Clear Log
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4" ref={scrollRef}>
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="text-4xl opacity-40">{'>'}_</div>
                <p>RepoRetriever is waiting for commands.</p>
                <p className="text-xs">Train it first and start fetching!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const config = levelConfig[log.level];
                const Icon = config.icon;
                const url = extractUrl(log.message);
                const messageWithoutUrl = url ? log.message.replace(url, '').trim() : log.message;

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg ${config.bgColor} transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs neu-pill border-0">
                            {formatTime(log.timestamp)}
                          </Badge>
                        </div>
                        <p className="text-sm break-words font-mono">{messageWithoutUrl}</p>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                          >
                            {url.length > 50 ? url.substring(0, 50) + '...' : url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
