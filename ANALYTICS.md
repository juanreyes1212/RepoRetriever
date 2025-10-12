# Analytics & User Tracking

RepoRetriever includes comprehensive analytics powered by Supabase for tracking user behavior, workflow performance, and gathering feedback.

## Overview

Analytics help us understand:
- How users interact with achievements
- Which workflows succeed or fail
- User engagement patterns
- Performance bottlenecks
- Feature usage and preferences

## Architecture

### Database Schema

**user_sessions**
- Tracks user login/logout sessions
- Monitors activity duration
- Identifies active vs inactive users

**achievement_workflows**
- Records every workflow execution
- Captures success/failure rates
- Measures completion times
- Tracks auto-deletion usage

**user_actions**
- Logs all user interactions
- Page views and navigation
- Button clicks and settings changes
- Stored as structured JSONB data

**user_feedback**
- Collects user feedback
- Bug reports and feature requests
- Ratings and satisfaction scores
- Optional email for follow-up

### Security

All analytics tables use **Row Level Security (RLS)**:
- Users can only access their own data
- Tokens stored server-side only
- No client-side data exposure
- Automatic data isolation by user_id

## Implementation

### Session Tracking

```typescript
import { AnalyticsService } from '@/lib/analytics';

// Start session on login
const sessionId = await AnalyticsService.startSession(
  userId,
  username
);

// Update activity periodically
await AnalyticsService.updateSessionActivity(sessionId);

// End session on logout
await AnalyticsService.endSession(sessionId);
```

### Workflow Tracking

```typescript
// Track workflow start
const workflowId = await AnalyticsService.trackWorkflowStart(
  userId,
  'pull_shark'
);

// Track workflow completion
await AnalyticsService.trackWorkflowComplete(workflowId, {
  status: 'completed',
  repository_url: 'https://github.com/user/repo',
  pull_request_url: 'https://github.com/user/repo/pull/1',
  auto_deleted: true,
  duration_ms: 3500,
});

// Track workflow failure
await AnalyticsService.trackWorkflowComplete(workflowId, {
  status: 'failed',
  error_message: 'API rate limit exceeded',
  duration_ms: 1200,
});
```

### Action Tracking

```typescript
// Track button click
await AnalyticsService.trackAction(
  userId,
  'button_click',
  { button_id: 'fetch-achievement', achievement: 'pull_shark' },
  '/dashboard'
);

// Track setting change
await AnalyticsService.trackAction(
  userId,
  'setting_change',
  { setting: 'auto_delete', value: true }
);

// Track page view
await AnalyticsService.trackAction(
  userId,
  'page_view',
  { referrer: document.referrer },
  window.location.pathname
);
```

### User Feedback

```typescript
// Submit feedback
const success = await AnalyticsService.submitFeedback({
  user_id: userId,
  feedback_type: 'feature_request',
  rating: 5,
  message: 'Would love to see YOLO achievement support!',
  contact_email: 'user@example.com',
});
```

## Analytics Dashboard

### User Stats

The `AnalyticsDashboard` component displays:
- Total workflows executed
- Completed vs failed workflows
- Success rate percentage
- Breakdown by achievement type
- Recent workflow history

```typescript
import { AnalyticsDashboard } from '@/components/analytics-dashboard';

<AnalyticsDashboard userId={session.user.id} />
```

### Key Metrics

```typescript
const stats = await AnalyticsService.getUserStats(userId);
// Returns:
// {
//   total_workflows: 42,
//   completed: 38,
//   failed: 4,
//   in_progress: 0,
//   by_type: {
//     pull_shark: 15,
//     quickdraw: 12,
//     yolo: 15
//   }
// }
```

## Feedback Collection

### Feedback Dialog

The `FeedbackDialog` component provides a user-friendly form:

```typescript
import { FeedbackDialog } from '@/components/feedback-dialog';

<FeedbackDialog userId={session.user.id} />
```

Features:
- Feedback type selection (bug, feature, general)
- 1-5 star rating
- Free-form message
- Optional email for follow-up
- Toast notifications on submission

### Feedback Types

**Bug Reports**
- Describe unexpected behavior
- Include error messages
- Note steps to reproduce

**Feature Requests**
- Suggest new achievements
- Propose workflow improvements
- Request UI enhancements

**General Feedback**
- Share overall experience
- Rate application satisfaction
- Provide constructive suggestions

## Privacy & Data

### What We Track
✅ Workflow execution and outcomes
✅ Feature usage patterns
✅ Error rates and types
✅ Session duration and activity
✅ User-submitted feedback

### What We Don't Track
❌ Personal identifying information (beyond GitHub ID)
❌ Repository contents or code
❌ GitHub access tokens
❌ Third-party integrations
❌ Browser fingerprints or tracking pixels

### Data Retention

- **Sessions**: Retained for 90 days
- **Workflows**: Retained indefinitely
- **Actions**: Retained for 30 days
- **Feedback**: Retained indefinitely

### Data Access

Users can:
- View their own analytics dashboard
- Export all personal data
- Request data deletion
- Opt out of tracking (coming soon)

## Querying Analytics

### Get User Workflows

```typescript
const workflows = await AnalyticsService.getUserWorkflows(userId, 50);
// Returns last 50 workflows with full details
```

### Get User Statistics

```typescript
const stats = await AnalyticsService.getUserStats(userId);
// Returns aggregated metrics
```

### Custom Queries (Backend)

Using Supabase directly:

```typescript
import { supabase } from '@/lib/analytics';

// Get workflows in date range
const { data } = await supabase
  .from('achievement_workflows')
  .select('*')
  .eq('user_id', userId)
  .gte('created_at', startDate)
  .lte('created_at', endDate)
  .order('created_at', { ascending: false });

// Get success rate by achievement type
const { data: stats } = await supabase
  .from('achievement_workflows')
  .select('achievement_type, status')
  .eq('user_id', userId);
```

## Performance Considerations

### Batching

Action tracking is debounced to reduce database writes:

```typescript
// Don't track every mouse movement
// Only track meaningful interactions
await AnalyticsService.trackAction(userId, 'significant_action');
```

### Async Operations

All analytics calls are non-blocking:

```typescript
// Fire and forget - don't await
AnalyticsService.trackAction(userId, 'page_view').catch(console.error);

// Continue with user-facing operations
await fetchUserData();
```

### Indexing

All analytics tables have optimized indexes:
- `user_id` for fast user queries
- `created_at` for time-range queries
- `achievement_type` for aggregations
- JSONB indexes for action_data queries

## Admin Dashboard (Future)

Planned features for admin view:
- Aggregate statistics across all users
- Most popular achievements
- Common failure patterns
- Average workflow durations
- Feedback summary and trends
- User retention metrics

## API Endpoints

### Track Workflow (Example)

```typescript
// POST /api/analytics/workflow
{
  "action": "start",
  "achievement_type": "pull_shark",
  "user_id": "github|12345"
}

// Response
{
  "workflow_id": "uuid-here",
  "status": "in_progress"
}
```

### Submit Feedback

```typescript
// POST /api/analytics/feedback
{
  "feedback_type": "bug",
  "rating": 3,
  "message": "Error when clicking fetch",
  "contact_email": "user@example.com"
}

// Response
{
  "success": true,
  "id": "uuid-here"
}
```

## Testing Analytics

### Mock Analytics Service

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('mockAnalytics', () => {
  cy.intercept('POST', '/api/analytics/**', {
    statusCode: 200,
    body: { success: true },
  });
});

// In tests
cy.mockAnalytics();
cy.visit('/');
```

### Test Data

Create test fixtures for analytics:

```json
// cypress/fixtures/analytics.json
{
  "stats": {
    "total_workflows": 10,
    "completed": 8,
    "failed": 2
  },
  "workflows": [
    {
      "id": "test-1",
      "achievement_type": "pull_shark",
      "status": "completed"
    }
  ]
}
```

## Monitoring

### Error Tracking

All analytics failures are logged but don't block user operations:

```typescript
try {
  await AnalyticsService.trackAction(userId, 'action');
} catch (error) {
  console.error('Analytics error:', error);
  // User experience not affected
}
```

### Health Checks

Monitor analytics system health:
- Database connection status
- Query response times
- Error rates
- Data ingestion rates

## Compliance

### GDPR Compliance
- Users can export all data
- Data deletion on request
- Clear privacy policy
- Consent mechanisms

### Data Minimization
- Only collect necessary data
- No excessive tracking
- Purpose-limited use
- Secure storage

---

**Analytics help us build a better product while respecting user privacy.**
