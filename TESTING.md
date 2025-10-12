# Testing Guide

RepoRetriever uses Cypress for comprehensive E2E and component testing.

## Test Coverage

### Component Tests
- **Achievement Card**: Rendering, states, interactions
- **Settings Panel**: Toggle controls, data management, confirmations
- **Activity Log**: Entry display, filtering, timestamps
- **Theme Toggle**: Dark/light mode switching

### E2E User Flows
- **Authentication Flow**: GitHub OAuth sign-in and session management
- **Achievement Workflows**: Complete PR automation from start to finish
- **Settings Management**: Auto-delete configuration and data export

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Ensure dev server is NOT running (Cypress will start it)
```

### Interactive Mode

Open Cypress Test Runner for development:

```bash
npm run test:open
```

This opens the Cypress GUI where you can:
- Select E2E or Component testing
- Choose specific test files
- Watch tests run in real browser
- Debug with DevTools
- See test results immediately

### Headless Mode

Run all tests in CI/headless mode:

```bash
# Run all tests
npm test

# Run only E2E tests
npm run test:e2e

# Run only component tests
npm run test:component
```

## Test Structure

### Component Tests
Location: `cypress/component/*.cy.tsx`

Example:
```typescript
import { AchievementCard } from '../../components/achievement-card';

describe('AchievementCard Component', () => {
  it('renders with correct props', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        status="locked"
        onClick={() => {}}
      />
    );
    cy.contains('Pull Shark').should('be.visible');
  });
});
```

### E2E Tests
Location: `cypress/e2e/*.cy.ts`

Example:
```typescript
describe('Achievement Workflow', () => {
  beforeEach(() => {
    cy.mockGitHubAuth();
    cy.visit('/');
  });

  it('completes Pull Shark workflow', () => {
    cy.intercept('POST', '/api/achievements/pull-shark', {
      statusCode: 200,
      body: { success: true },
    }).as('workflow');

    cy.contains('Fetch Achievement').click();
    cy.wait('@workflow');
    cy.contains('Achievement unlocked!').should('be.visible');
  });
});
```

## Custom Commands

RepoRetriever includes custom Cypress commands:

### `cy.login()`
Creates a mock authenticated session.

```typescript
cy.login();
cy.visit('/');
```

### `cy.mockGitHubAuth()`
Intercepts GitHub OAuth API calls.

```typescript
cy.mockGitHubAuth();
cy.visit('/');
cy.contains('Test User').should('be.visible');
```

### `cy.waitForApiCall(alias)`
Waits for API call and verifies success.

```typescript
cy.intercept('POST', '/api/achievements/*').as('achievement');
cy.waitForApiCall('achievement');
```

## Testing Best Practices

### 1. Isolate Tests
Each test should be independent and not rely on other tests.

```typescript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

### 2. Use Data Attributes
Use `data-testid` for stable selectors.

```typescript
// Component
<button data-testid="fetch-achievement">Fetch</button>

// Test
cy.get('[data-testid="fetch-achievement"]').click();
```

### 3. Mock External APIs
Always mock GitHub API calls in tests.

```typescript
cy.intercept('GET', 'https://api.github.com/user', {
  statusCode: 200,
  body: { login: 'testuser' },
});
```

### 4. Test User Flows
Test complete workflows, not just isolated actions.

```typescript
it('completes full achievement workflow', () => {
  cy.login();
  cy.visit('/');
  cy.contains('Settings').click();
  cy.get('#auto-delete').click();
  cy.contains('Pull Shark').parents('.clay-card').find('button').click();
  cy.contains('repository deleted successfully').should('be.visible');
});
```

## Debugging Tests

### 1. Use `.only()` to Run Single Test
```typescript
it.only('should test specific behavior', () => {
  // This test runs alone
});
```

### 2. Add Debug Points
```typescript
cy.get('button').click();
cy.debug(); // Pauses test execution
cy.contains('Success').should('be.visible');
```

### 3. Take Screenshots
```typescript
cy.screenshot('before-click');
cy.get('button').click();
cy.screenshot('after-click');
```

### 4. Use Console Logs
```typescript
cy.get('.result').then(($el) => {
  console.log('Element text:', $el.text());
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

## Test Fixtures

Store reusable test data in `cypress/fixtures/`:

```json
// cypress/fixtures/user.json
{
  "login": "testuser",
  "name": "Test User",
  "email": "test@example.com"
}
```

Use in tests:
```typescript
cy.fixture('user').then((user) => {
  cy.intercept('GET', '/api/github/user', user);
});
```

## Coverage Goals

- ✅ All components render correctly
- ✅ All user interactions work as expected
- ✅ Error states display properly
- ✅ Loading states show correctly
- ✅ Authentication flow completes
- ✅ Achievement workflows execute
- ✅ Settings persist across sessions
- ✅ Data export functions correctly

## Troubleshooting

### Tests Fail Locally But Pass in CI
- Clear browser cache and cookies
- Reset localStorage
- Check for port conflicts (default: 3000)

### Timeouts
Increase timeout in `cypress.config.ts`:
```typescript
defaultCommandTimeout: 10000, // 10 seconds
```

### Flaky Tests
- Add explicit waits for API calls
- Use `cy.intercept()` instead of real API calls
- Avoid using `cy.wait(milliseconds)`

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Keep tests fast, focused, and reliable!**
