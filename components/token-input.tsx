'use client';

import * as React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Github, LogOut, Shield, Dog, Zap } from 'lucide-react';
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
      <Card className="neu-surface border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5 text-primary" aria-hidden="true" />
            Checking Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8" role="status" aria-label="Loading authentication status">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <Card className="neu-surface border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Dog className="h-5 w-5 text-primary glow-primary" aria-hidden="true" />
              RepoRetriever Ready
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive"
              aria-label="Sign out of GitHub"
            >
              <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
              Sign Out
            </Button>
          </CardTitle>
          <CardDescription>
            Standing by and ready to fetch! Your token is securely stored on the server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 neu-pill">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback className="bg-transparent">
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

          <Alert className="mt-4 neu-inset border-0">
            <Shield className="h-4 w-4 text-accent" aria-hidden="true" />
            <AlertDescription className="text-muted-foreground">
              <span className="text-accent font-medium">Secure Connection:</span>{' '}
              Your GitHub token is encrypted and stored server-side with HttpOnly cookies.
              It&apos;s never exposed to client-side JavaScript.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neu-surface border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
          <Github className="h-8 w-8 text-primary glow-primary" aria-hidden="true" />
          Automate Your GitHub Profile
        </CardTitle>
        <CardDescription className="text-base mt-2">
          One-click achievements, auto-cleanup, and instant contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl neu-inset">
              <div className="text-4xl mb-2" aria-hidden="true">🦴</div>
              <h3 className="font-semibold mb-1 text-primary">Pull Shark</h3>
              <p className="text-xs text-muted-foreground">Fetch & merge PRs</p>
            </div>
            <div className="text-center p-4 rounded-xl neu-inset">
              <div className="text-4xl mb-2" aria-hidden="true">🥏</div>
              <h3 className="font-semibold mb-1 text-primary">Quickdraw</h3>
              <p className="text-xs text-muted-foreground">Quick issue fetch</p>
            </div>
            <div className="text-center p-4 rounded-xl neu-inset">
              <div className="text-4xl mb-2" aria-hidden="true">🎾</div>
              <h3 className="font-semibold mb-1 text-primary">YOLO</h3>
              <p className="text-xs text-muted-foreground">Direct commits</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl neu-inset">
              <div className="text-2xl flex-shrink-0" aria-hidden="true">🐕</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Add to Awesome Lists</h4>
                <p className="text-xs text-muted-foreground">Auto-contribute to curated lists and showcase repos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl neu-inset">
              <div className="text-2xl flex-shrink-0" aria-hidden="true">🐾</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Instant Contributions</h4>
                <p className="text-xs text-muted-foreground">Build your contribution graph automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl neu-inset">
              <div className="text-2xl flex-shrink-0" aria-hidden="true">🦮</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Smart Cleanup</h4>
                <p className="text-xs text-muted-foreground">Test repos auto-delete after achievements unlock</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignIn}
            className="w-full text-lg py-6 neu-button glow-ring-primary"
            disabled={isSigningIn}
            size="lg"
            aria-label="Sign in with GitHub"
          >
            <Github className="mr-2 h-6 w-6" aria-hidden="true" />
            {isSigningIn ? 'Connecting...' : 'Get Started Free'}
          </Button>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-accent" aria-hidden="true" />
              <span>OAuth Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
              <span>Setup in 30s</span>
            </div>
            <div className="flex items-center gap-1">
              <Dog className="h-3 w-3 text-primary" aria-hidden="true" />
              <span>Private by default</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
