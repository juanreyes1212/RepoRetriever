'use client';

import * as React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Github, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TokenInput() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <Card className="clay-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Checking Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'authenticated' && session?.user) {
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
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive clay-button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardTitle>
          <CardDescription>
            Standing by and ready to fetch! Your token is securely stored on the server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {session.user.email || 'github.com/' + session.user.name}
              </p>
            </div>
          </div>

          <Alert className="mt-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Secure Connection:</strong> Your GitHub token is encrypted and stored server-side with HttpOnly cookies. It&apos;s never exposed to client-side JavaScript.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="clay-card border-2">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
          <Github className="h-8 w-8" />
          Automate Your GitHub Profile
        </CardTitle>
        <CardDescription className="text-base mt-2">
          One-click achievements, auto-cleanup, and instant contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-2">🦈</div>
              <h3 className="font-semibold mb-1">Pull Shark</h3>
              <p className="text-xs text-muted-foreground">Auto-merge PRs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Quickdraw</h3>
              <p className="text-xs text-muted-foreground">Fast issue closing</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">YOLO</h3>
              <p className="text-xs text-muted-foreground">Direct commits</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-muted">
              <div className="text-2xl flex-shrink-0">🌟</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Add to Awesome Lists</h4>
                <p className="text-xs text-muted-foreground">Auto-contribute to curated lists and showcase repos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-muted">
              <div className="text-2xl flex-shrink-0">🚀</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Instant Contributions</h4>
                <p className="text-xs text-muted-foreground">Build your contribution graph automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-muted">
              <div className="text-2xl flex-shrink-0">🧹</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Smart Cleanup</h4>
                <p className="text-xs text-muted-foreground">Test repos auto-delete after achievements unlock</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignIn}
            className="w-full clay-button text-lg py-6"
            disabled={isSigningIn}
            size="lg"
          >
            <Github className="mr-2 h-6 w-6" />
            {isSigningIn ? 'Connecting...' : 'Get Started Free'}
          </Button>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>OAuth Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span>Setup in 30s</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Private by default</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
