'use client';

import * as React from 'react';
import { Settings, Trash2, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SettingsPanelProps {
  autoDeleteRepos: boolean;
  onAutoDeleteChange: (value: boolean) => void;
  onClearHistory: () => void;
  onClearLogs: () => void;
  onExportData: () => void;
  historyCount: number;
  logCount: number;
}

export function SettingsPanel({
  autoDeleteRepos,
  onAutoDeleteChange,
  onClearHistory,
  onClearLogs,
  onExportData,
  historyCount,
  logCount,
}: SettingsPanelProps) {
  return (
    <Card className="clay-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
        <CardDescription>Manage your preferences and data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="auto-delete">Delete repositories after unlock</Label>
              <p className="text-sm text-muted-foreground">
                Automatically clean up created repositories after achievements are unlocked
              </p>
            </div>
            <Switch
              id="auto-delete"
              checked={autoDeleteRepos}
              onCheckedChange={onAutoDeleteChange}
            />
          </div>

          {autoDeleteRepos && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Repositories will be permanently deleted from GitHub after each achievement. This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Data Management</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Achievement History</p>
                <p className="text-xs text-muted-foreground">{historyCount} records stored</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={historyCount === 0} className="clay-button">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear achievement history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {historyCount} achievement records from your browser storage. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearHistory}>Clear History</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Activity Logs</p>
                <p className="text-xs text-muted-foreground">{logCount} entries stored</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={logCount === 0} className="clay-button">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear activity logs?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all {logCount} log entries from your browser storage. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearLogs}>Clear Logs</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onExportData}
              disabled={historyCount === 0 && logCount === 0}
              className="w-full clay-button"
            >
              <Download className="h-3 w-3 mr-2" />
              Export All Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
