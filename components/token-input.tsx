'use client';

import * as React from 'react';
import { Eye, EyeOff, Github, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TokenInputProps {
  onConnect: (token: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  username?: string;
  avatarUrl?: string;
  isValidating?: boolean;
  error?: string;
}

export function TokenInput({
  onConnect,
  onDisconnect,
  isConnected,
  username,
  avatarUrl,
  isValidating,
  error,
}: TokenInputProps) {
  const [token, setToken] = React.useState('');
  const [showToken, setShowToken] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onConnect(token.trim());
    }
  };

  if (isConnected && username) {
    return (
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              RepoRetriever Ready
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDisconnect}
              className="text-destructive hover:text-destructive clay-button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </CardTitle>
          <CardDescription>
            Standing by and ready to fetch! Token secured in this tab only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{username}</p>
              <p className="text-sm text-muted-foreground">github.com/{username}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="clay-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Train Your RepoRetriever
        </CardTitle>
        <CardDescription>
          Give RepoRetriever your GitHub token so it can fetch achievements for you. Token stays in this tab only - no servers involved!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showToken ? 'text' : 'password'}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isValidating}
              className="pr-10 clay-input"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full clay-button"
              disabled={!token.trim() || isValidating}
            >
              {isValidating ? 'Training...' : 'Let\'s Go!'}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Required token scopes:</p>
              <ul className="list-disc list-inside pl-2">
                <li>repo (full repository access)</li>
                <li>delete_repo (for cleanup option)</li>
              </ul>
              <p className="mt-2">
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,delete_repo&description=RepoRetriever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get a token for your RepoRetriever →
                </a>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
