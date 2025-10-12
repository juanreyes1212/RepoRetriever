# 🐕 RepoRetriever

Automate your GitHub workflow with intelligence and precision. RepoRetriever helps you unlock achievements, learn the GitHub API, test automation workflows, and practice contribution patterns in a safe, controlled environment.

## What RepoRetriever Does

**GitHub Achievement Automation**
Unlock GitHub profile achievements through automated workflows. Understand how achievements work by seeing the exact API calls and patterns required.

**Workflow Testing & Learning**
Practice GitHub automation patterns, test API interactions, and learn repository management without affecting production projects.

**Contribution Pattern Practice**
Generate realistic contribution patterns for testing CI/CD pipelines, exploring Git workflows, and understanding collaborative development.

**API Rate Limit Management**
Monitor and optimize GitHub API usage with built-in rate limit tracking, exponential backoff, and intelligent request scheduling.

**Clean Development Environment**
Automatic repository and pull request cleanup keeps your GitHub account organized. All test repositories are clearly marked and can be batch-deleted.

## Core Features

### 🎯 Achievement Automation

- **Pull Shark** - Automated PR creation and merging workflows
- **Quickdraw** - Issue creation and rapid resolution patterns
- **YOLO** - Direct commit workflows and main branch strategies
- **Pair Extraordinaire** - Co-authored commit automation
- **Galaxy Brain** - Discussion interaction workflows
- **Heart On Your Sleeve** - Reaction and engagement patterns
- **Open Sourcerer** - External contribution simulation
- **Starstruck** - Repository visibility optimization

### ⚙️ Workflow Modes

**One-Click Express**
Fully automated workflow execution with progress tracking and real-time logging.

**Step-by-Step Guided**
Interactive mode with manual confirmation at each step. Perfect for learning and understanding each API call.

**Scheduled Campaigns**
Spread actions over days or weeks for high-tier achievements. Configurable frequency and drip scheduling to respect rate limits.

### 🧹 Cleanup & Organization

**Automatic Repository Deletion**
Configure auto-cleanup for test repositories after workflow completion. Keeps your GitHub profile clean.

**Pull Request Management**
Automatic PR closure and branch deletion after achievement workflows complete.

**Configurable Naming**
- **Professional Mode**: Realistic repo names like "sandbox-project" and "demo-app"
- **Custom Templates**: Define your own naming patterns with variables
- **Descriptive Mode**: Clear names like "practice-repo" and "test-workflow"

### 🔒 Security & Privacy

**Server-Side Token Storage**
GitHub tokens stored securely with encrypted HttpOnly cookies. Never exposed to client-side JavaScript.

**OAuth Authentication**
One-click GitHub OAuth sign-in. No manual token copying or credential management.

**Rate Limit Protection**
Automatic rate limit detection, exponential backoff, and intelligent request throttling.

### 📊 Monitoring & Insights

**Activity Logging**
Detailed audit trail of all API calls, responses, and workflow steps.

**Achievement History**
Track completed workflows, duration, success rates, and repository URLs.

**Progress Tracking**
Real-time progress indicators for long-running workflows.

**Analytics Dashboard**
View comprehensive statistics including success rates, workflow breakdowns, and performance metrics powered by Supabase.

**User Feedback**
Built-in feedback system for bug reports, feature requests, and ratings with optional email follow-up.

**Data Export**
Export your activity logs and achievement history as JSON for analysis.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Configure GitHub OAuth (see SETUP.md for details)
# Add your GITHUB_ID and GITHUB_SECRET to .env

# Start the application
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with GitHub.

### First Workflow

1. **Sign in** with your GitHub account
2. **Choose an achievement** from the dashboard
3. **Configure settings** (optional: enable auto-cleanup)
4. **Run the workflow** and watch it complete
5. **Check your GitHub profile** to see the achievement unlock

## Configuration Options

### Repository Settings

```typescript
{
  namingMode: 'professional' | 'custom' | 'descriptive',
  autoDeleteRepos: true | false,
  customRepoTemplate: 'my-project-{date}',
  customCommitTemplate: 'Update files - {timestamp}'
}
```

### Workflow Settings

```typescript
{
  executionMode: 'express' | 'guided' | 'scheduled',
  frequency: 'daily' | 'weekly' | 'custom',
  targetTier: 'default' | 'bronze' | 'silver' | 'gold'
}
```

## Use Cases

### For Developers
- Learn GitHub's REST API through practical examples
- Test automation scripts in a safe environment
- Practice Git workflows without affecting real projects
- Understand achievement requirements and patterns

### For Testers
- Generate test repositories for CI/CD pipeline testing
- Create realistic contribution patterns for QA environments
- Test GitHub integrations and webhooks
- Simulate collaborative development scenarios

### For Students
- Learn version control workflows hands-on
- Understand GitHub's achievement system
- Practice API authentication and rate limiting
- Build portfolio projects demonstrating API skills

### For Teams
- Prototype GitHub automation workflows
- Test repository management strategies
- Validate security and permission patterns
- Train new team members on GitHub workflows

## Documentation

- **[SETUP.md](./SETUP.md)** - Complete installation and configuration guide
- **[TESTING.md](./TESTING.md)** - Cypress testing guide and best practices
- **[ANALYTICS.md](./ANALYTICS.md)** - Analytics implementation and user tracking
- **[BUN_MIGRATION.md](./BUN_MIGRATION.md)** - Performance optimization with Bun
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Comprehensive project audit results

## Available Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # Code linting
npm run typecheck  # Type checking
npm test           # Run all Cypress tests
npm run test:open  # Open Cypress Test Runner
npm run test:e2e   # Run E2E tests only
```

## Security & Ethics

**Data Privacy**
- Tokens stored server-side with encryption
- Analytics data isolated per user with RLS
- No data sent to third-party services
- Export and deletion available on request

**Ethical Use**
- Clearly mark automated repositories
- Respect GitHub's rate limits
- Follow GitHub's Terms of Service
- Use for learning and testing only

**Responsible Automation**
- Automatic cleanup available
- Rate limit monitoring built-in
- Transparent audit logging
- No deceptive practices

## Technical Architecture

**Frontend**: React with Next.js for server-side rendering and API routes

**Authentication**: NextAuth.js with GitHub OAuth provider for secure token management

**Database**: Supabase PostgreSQL for workflow configuration and campaign scheduling

**Runtime**: Compatible with both Node.js and Bun for optimal performance

See [SETUP.md](./SETUP.md) for detailed architecture diagrams and security implementation.

## Contributing

Contributions welcome! Focus areas:
- Additional achievement automations
- Improved rate limit handling
- Enhanced workflow configurations
- Better error handling and recovery

## License

Educational use only. Follow GitHub's Terms of Service and API usage guidelines.

## Disclaimer

RepoRetriever is a learning tool for understanding GitHub's API and achievement system. Use responsibly and ethically. Achievements should ultimately reflect genuine contributions to the developer community.

---

**Built for learning, testing, and responsible GitHub automation.**
