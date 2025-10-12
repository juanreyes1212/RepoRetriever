/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      mockGitHubAuth(): Chainable<void>;
      waitForApiCall(alias: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.session('github-oauth', () => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('mock-auth', 'true');
    });
  });
});

Cypress.Commands.add('mockGitHubAuth', () => {
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://avatars.githubusercontent.com/u/123456',
      },
      accessToken: 'mock-token-123',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  }).as('session');
});

Cypress.Commands.add('waitForApiCall', (alias: string) => {
  cy.wait(`@${alias}`).its('response.statusCode').should('be.oneOf', [200, 201]);
});

export {};
