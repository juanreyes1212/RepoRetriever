'use client';

import * as React from 'react';
import { Award, CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type AchievementStatus = 'idle' | 'in_progress' | 'success' | 'error';

interface AchievementCardProps {
  title: string;
  description: string;
  emoji: string;
  status: AchievementStatus;
  progress?: number;
  onUnlock: () => void;
  disabled?: boolean;
  estimatedTime?: string;
  requirements?: string;
}

const statusConfig = {
  idle: {
    icon: Award,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Ready',
  },
  in_progress: {
    icon: Loader2,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    label: 'Running',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Complete',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    label: 'Failed',
  },
};

export function AchievementCard({
  title,
  description,
  emoji,
  status,
  progress = 0,
  onUnlock,
  disabled,
  estimatedTime,
  requirements,
}: AchievementCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={`clay-card transition-all ${status === 'in_progress' ? 'ring-2 ring-warning' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{emoji}</div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={`clay-badge ${config.bgColor} ${config.color} border-0`}>
            <StatusIcon className={`h-3 w-3 mr-1 ${status === 'in_progress' ? 'animate-spin' : ''}`} />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {status === 'in_progress' && (
          <div className="space-y-2">
            <div className="relative h-3 w-full overflow-hidden rounded-full clay-input">
              <div
                className="h-full bg-primary transition-all rounded-full"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Fetching: {progress}%</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {estimatedTime && (
            <div className="flex items-center gap-1 clay-badge px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{estimatedTime}</span>
            </div>
          )}
          {requirements && (
            <div className="flex items-center gap-1 clay-badge px-2 py-1 rounded-full">
              <Award className="h-3 w-3" />
              <span>{requirements}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onUnlock}
          disabled={disabled || status === 'in_progress'}
          className="w-full clay-button"
          variant={status === 'error' ? 'outline' : 'default'}
        >
          {status === 'in_progress' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : status === 'error' ? (
            'Try Again'
          ) : (
            'Fetch Achievement'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
