# RepoRetriever

Your loyal companion for fetching GitHub achievements.

## What It Is

RepoRetriever is a GitHub achievement automation tool. It performs the real sequence of GitHub API actions that trigger profile achievements — creating repositories, opening and merging pull requests, opening and closing issues, and pushing direct commits to main. You sign in with GitHub, pick an achievement, and RepoRetriever does the fetching.

## What It Fetches

**Pull Shark** — Creates a repository, opens a pull request from a feature branch, and merges it into main. GitHub awards Pull Shark for merged PRs.

**Quickdraw** — Creates a repository, opens an issue, and closes it within seconds. GitHub awards Quickdraw for rapidly resolving issues.

**YOLO** — Creates a repository and pushes commits directly to the main branch without a pull request. GitHub awards YOLO for committing straight to main.

## How It Works

1. **Sign in with GitHub OAuth** — Your token is stored server-side in encrypted HttpOnly cookies. It is never exposed to client-side JavaScript.
2. **Choose an achievement** — Each card shows the estimated time and what GitHub actions it performs.
3. **Fetch** — RepoRetriever calls the GitHub API to perform the exact operations that trigger the achievement. Progress is shown in real-time.
4. **Optional cleanup** — Enable auto-delete and RepoRetriever removes the test repository after the achievement actions complete, keeping your GitHub profile tidy.

## About Achievement Validation

GitHub does not expose a user's earned achievements through its API. There is no endpoint that returns "this user has the Pull Shark badge." RepoRetriever therefore cannot confirm whether an achievement actually unlocked — it only confirms that the actions which should trigger it were performed successfully. The success state in the UI means the API operations completed, not that GitHub confirmed the badge.

## Privacy & Security

- **OAuth authentication** — No manual token copying. Sign in with GitHub, sign out anytime.
- **Server-side token storage** — Tokens live in encrypted HttpOnly cookies, never in the browser.
- **Local-only data** — Your activity log and fetch history are stored in your browser's local storage. Nothing is sent to a database or third-party service.
- **Data export** — Export your full history and logs as JSON at any time.
- **Data clearing** — Clear your history or logs individually, or export everything before clearing.

## Responsible Use

RepoRetriever is a learning tool for understanding GitHub's API and achievement system. Use it responsibly:
- Enable auto-cleanup to avoid cluttering your GitHub profile with test repositories
- Respect GitHub's rate limits — the app monitors them automatically
- Follow GitHub's Terms of Service
- Achievements should ultimately reflect genuine contributions to the developer community

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js with GitHub OAuth
- **GitHub API**: Server-side API routes calling GitHub's REST API
- **Data storage**: Browser local storage (no database)
- **Design**: Dark neumorphism with subtle CRT/sci-fi accents

---

**Built for learning, testing, and responsible GitHub automation.**
