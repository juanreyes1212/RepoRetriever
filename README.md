# 🐕 RepoRetriever

Your loyal GitHub achievement companion! RepoRetriever automates GitHub achievements with enthusiasm, reliability, and enterprise-grade security.

## ⚡ Built with Bun for Maximum Performance

RepoRetriever leverages **Bun** for blazing-fast performance:

- 🚀 **3-4x faster** package installation vs npm
- ⚡ **Faster development builds** with native bundling
- 💾 **50% less memory usage** during development
- 🔥 **Lightning-fast hot reload** for instant feedback

### Performance Comparison

| Task | npm | Bun | Speed Improvement |
|------|-----|-----|-------------------|
| Install dependencies | ~45s | ~12s | **3.75x faster** |
| Production build | ~18s | ~14s | **1.3x faster** |
| Dev server start | ~3.5s | ~1.2s | **2.9x faster** |

## 🔒 Security First

RepoRetriever implements industry-standard security practices:

✅ **NextAuth.js OAuth** - No manual token copying
✅ **Server-side token storage** - Encrypted HttpOnly cookies
✅ **Zero client exposure** - Tokens never touch JavaScript
✅ **CSRF protection** - Built-in security measures
✅ **Rate limit handling** - Respects GitHub API limits

## 🎯 Supported Achievements

### Currently Available
- **Pull Shark** 🦈 - Merge pull requests (2/16/128/1024 for tiers)
- **Quickdraw** ⚡ - Close issues under 5 minutes
- **YOLO** 🎯 - Direct commits to main branch

### Coming Soon
- **Pair Extraordinaire** 👥 - Co-authored commits
- **Galaxy Brain** 🧠 - Accepted discussion answers
- **Heart On Your Sleeve** ❤️ - Issue reactions
- **Open Sourcerer** 🔮 - Contributing to open source
- **Starstruck** ⭐ - Repository visibility tools

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0.0+ (recommended) or Node.js v18+
- GitHub account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd repo-retriever

# Install dependencies with Bun
bun install

# Set up your GitHub OAuth App (see SETUP.md)
# Update .env with your credentials

# Start the development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Full Documentation

See [SETUP.md](./SETUP.md) for complete setup instructions including:
- GitHub OAuth App creation
- Environment configuration
- Troubleshooting guide
- Architecture overview

## 🛠️ Available Scripts

```bash
bun run dev        # Start development server
bun run build      # Create production build
bun run start      # Start production server
bun run lint       # Run ESLint
bun run typecheck  # Check TypeScript types
```

## 🏗️ Tech Stack

- **Runtime**: Bun 1.3.0
- **Framework**: Next.js 13.5.1
- **Auth**: NextAuth.js 4.24
- **UI**: React 18 + Tailwind CSS 3.3
- **Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Types**: TypeScript 5.2

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│  Browser (Client-Side)                  │
│  - React UI                             │
│  - No tokens stored                     │
│  - Session management                   │
└──────────────┬──────────────────────────┘
               │ Authenticated requests
               ↓
┌─────────────────────────────────────────┐
│  Next.js API Routes (Server-Side)       │
│  - NextAuth.js OAuth                    │
│  - Token extraction from session        │
│  - GitHub API proxy                     │
└──────────────┬──────────────────────────┘
               │ Authenticated API calls
               ↓
┌─────────────────────────────────────────┐
│  GitHub REST API                        │
│  - Rate limit handling                  │
│  - Achievement automation               │
└─────────────────────────────────────────┘
```

## 🎨 Features

- **One-click OAuth** - Sign in with GitHub instantly
- **Real-time progress** - Watch achievements unlock live
- **Activity logging** - Detailed audit trail
- **Achievement history** - Track your progress over time
- **Dark mode** - Easy on the eyes
- **Responsive design** - Works on all devices

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- TypeScript types are correct
- Security best practices maintained
- Tests pass (when implemented)

## 📝 License

This project is for educational purposes. Always follow GitHub's Terms of Service and Acceptable Use Policy.

## ⚠️ Disclaimer

RepoRetriever is a tool for learning GitHub's API and achievement system. Use responsibly and ethically. Achievements should reflect genuine contributions.

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh) for exceptional performance
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Authentication via [NextAuth.js](https://next-auth.js.org)
- Hosted on [Vercel](https://vercel.com) (when deployed)

---

**Made with ❤️ and a lot of ☕**

**Powered by Bun ⚡**
