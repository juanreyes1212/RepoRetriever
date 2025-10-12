describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows sign in button when not authenticated', () => {
    cy.contains('Sign in with GitHub').should('be.visible');
  });

  it('redirects to GitHub OAuth when sign in clicked', () => {
    cy.intercept('GET', '/api/auth/signin*', {
      statusCode: 200,
      body: {},
    }).as('signIn');

    cy.contains('Sign in with GitHub').click();
  });

  it('shows user info after successful authentication', () => {
    cy.mockGitHubAuth();
    cy.visit('/');

    cy.contains('Test User').should('be.visible');
  });

  it('shows achievement cards when authenticated', () => {
    cy.mockGitHubAuth();
    cy.visit('/');

    cy.contains('Pull Shark').should('be.visible');
    cy.contains('Quickdraw').should('be.visible');
    cy.contains('YOLO').should('be.visible');
  });
});
