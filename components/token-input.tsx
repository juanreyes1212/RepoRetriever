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
    <Card className="clay-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Train Your RepoRetriever
        </CardTitle>
        <CardDescription>
          Sign in with GitHub using secure OAuth. No manual tokens needed!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full clay-button"
            disabled={isSigningIn}
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            {isSigningIn ? 'Connecting...' : 'Sign in with GitHub'}
          </Button>

          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Enhanced Security:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>OAuth authentication (no token copying)</li>
                <li>Server-side token storage only</li>
                <li>Encrypted HttpOnly cookies</li>
                <li>Never exposed to client-side code</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Requested permissions:</p>
            <ul className="list-disc list-inside pl-2">
              <li>Full repository access (repo)</li>
              <li>Read user profile (read:user)</li>
              <li>Read organizations (read:org)</li>
              <li>Read email (user:email)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
