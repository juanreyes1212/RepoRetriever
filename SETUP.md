# RepoRetriever - Setup Instructions

## Security Architecture Complete

RepoRetriever now uses **NextAuth.js** for secure, server-side authentication with GitHub OAuth. Your tokens are never exposed to client-side JavaScript.

---

## Prerequisites

1. A GitHub account
2. **Bun runtime installed** (v1.0.0+) - [Install Bun](https://bun.sh)
   - Alternatively: Node.js v18+ (but Bun is recommended for performance)

---

## Performance with Bun

RepoRetriever uses **Bun** as the JavaScript runtime and package manager for:
- ⚡ **3-4x faster** package installation than npm
- 🚀 **Faster builds** with native bundling
- 💾 **Lower memory usage** during development
- 🔥 **Hot reload optimization** for faster development

---

## Setup Steps

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: `RepoRetriever` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. You'll see your **Client ID**
6. Click "Generate a new client secret" to get your **Client Secret**

### 2. Configure Environment Variables

Open the `.env` file and update the GitHub OAuth credentials:

```env
# GitHub OAuth App Configuration
GITHUB_ID=your_actual_client_id_here
GITHUB_SECRET=your_actual_client_secret_here
```

**Note**: The other values (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Supabase config) are already set.

### 3. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or source ~/.zshrc for zsh
```

Verify installation:
```bash
bun --version
```

### 4. Install Dependencies

```bash
bun install
```

This will install all dependencies significantly faster than npm.

### 5. Run the Development Server

```bash
bun run dev
```

### 6. Open the Application

Navigate to [http://localhost:3000](http://localhost:3000)

---

## How It Works

### Secure Authentication Flow

1. **User clicks "Sign in with GitHub"**
   - Redirects to GitHub OAuth authorization page
   - User authorizes the application

2. **GitHub redirects back with authorization code**
   - NextAuth.js exchanges code for access token **on the server**
   - Token is encrypted and stored in an HttpOnly cookie
   - Token is **never** sent to the browser JavaScript

3. **Making API calls**
   - Frontend makes requests to `/api/achievements/*` routes
   - Server-side routes extract token from session
   - Server makes authenticated requests to GitHub API
   - Response is sent back to frontend

### Security Benefits

✅ **No token exposure**: Tokens never touch client-side code
✅ **HttpOnly cookies**: Cannot be accessed by JavaScript
✅ **Encrypted storage**: Tokens encrypted with `NEXTAUTH_SECRET`
✅ **CSRF protection**: Built into NextAuth.js
✅ **OAuth flow**: No manual token copying required

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Browser (Client-Side)                  │
│  - React UI                             │
│  - No tokens stored                     │
│  - SessionProvider for auth state       │
└──────────────┬──────────────────────────┘
               │ Authenticated requests
               ↓
┌─────────────────────────────────────────┐
│  Next.js Server (Server-Side)           │
│  ┌───────────────────────────────────┐  │
│  │ API Routes                        │  │
│  │  /api/auth/[...nextauth]          │  │
│  │  /api/achievements/pull-shark     │  │
│  │  /api/github/user                 │  │
│  └───────────────────────────────────┘  │
│  - Extracts token from session          │
│  - Makes GitHub API calls               │
│  - Returns sanitized responses          │
└──────────────┬──────────────────────────┘
               │ Authenticated API calls
               ↓
┌─────────────────────────────────────────┐
│  GitHub REST API                        │
│  - Rate limit handling                  │
│  - Secure token authentication          │
└─────────────────────────────────────────┘
```

---

## Requested OAuth Scopes

The application requests these GitHub permissions:

- **repo**: Full repository access (create, read, update)
- **read:user**: Read user profile information
- **read:org**: Read organization membership
- **user:email**: Read user email addresses

These scopes are necessary for automating GitHub achievements.

---

## Current Implementation Status

### ✅ Completed

- **Bun integration** for faster builds and package management
- NextAuth.js integration with GitHub provider
- Server-side session management
- Secure API route helpers
- GitHub API client with rate limit handling
- Pull Shark achievement API route
- Updated UI components for OAuth flow
- Removed all client-side token storage

### 🔄 Ready for Next Phase

- Quickdraw and YOLO API routes
- Additional achievements (Pair Extraordinaire, Galaxy Brain, etc.)
- Workflow configuration system (Supabase)
- Repository naming strategies
- Drip campaign scheduling
- Advanced error handling and retry logic

---

## Testing the Setup

1. Sign in with GitHub
2. You should see your profile information
3. Try clicking "Fetch Achievement" on Pull Shark
4. Check the Activity Log for detailed progress

---

## Troubleshooting

### "Unauthorized" error when fetching achievements

- Make sure you've created the GitHub OAuth App
- Verify `GITHUB_ID` and `GITHUB_SECRET` are correct in `.env`
- Try signing out and signing in again

### Build errors

```bash
bun run build
```

Should complete without errors. If not, check the console output.

### Bun not found

If you get "command not found: bun", ensure Bun is in your PATH:

```bash
export PATH="$HOME/.bun/bin:$PATH"
# Add this line to ~/.bashrc or ~/.zshrc to make it permanent
```

### Port already in use

If port 3000 is busy:

```bash
PORT=3001 bun run dev
```

Then update `NEXTAUTH_URL=http://localhost:3001` in `.env`

### Using npm instead of Bun

If you prefer to use npm:

```bash
npm install
npm run dev
```

Note: You'll need to update `package.json` scripts to remove the `bun --bun` prefix.

---

## Next Steps

Once authentication is working:

1. Test the Pull Shark achievement automation
2. Review the Activity Log to see API calls
3. Check your GitHub profile for the new repository
4. Explore the Settings panel for preferences

---

## Security Notes

🔒 **Never commit `.env` to version control**
🔒 **Rotate your `GITHUB_SECRET` if compromised**
🔒 **Keep `NEXTAUTH_SECRET` secret and random**
🔒 **Use environment variables in production**

---

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Rate Limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)

---

**RepoRetriever is now secure and ready to fetch achievements!** 🎉
