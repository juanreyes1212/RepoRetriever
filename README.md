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

**Built for learning, testing, and responsible GitHub automation.**
