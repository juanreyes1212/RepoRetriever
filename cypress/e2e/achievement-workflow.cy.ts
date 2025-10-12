describe('Achievement Workflow', () => {
  beforeEach(() => {
    cy.mockGitHubAuth();
    cy.visit('/');
  });

  it('completes Pull Shark achievement workflow', () => {
    cy.intercept('POST', '/api/achievements/pull-shark', {
      statusCode: 200,
      body: {
        success: true,
        repository: 'https://github.com/testuser/repo-pull-shark-123',
        pullRequest: 'https://github.com/testuser/repo-pull-shark-123/pull/1',
        deleted: false,
        message: 'Pull request created and merged successfully',
      },
    }).as('pullShark');

    cy.contains('Pull Shark').parents('.clay-card').find('button').contains('Fetch Achievement').click();

    cy.wait('@pullShark');
    cy.contains('Achievement unlocked!').should('be.visible');
    cy.contains('Pull request created and merged successfully').should('be.visible');
  });

  it('shows progress during achievement execution', () => {
    cy.intercept('POST', '/api/achievements/pull-shark', {
      delay: 2000,
      statusCode: 200,
      body: { success: true },
    }).as('pullShark');

    cy.contains('Pull Shark').parents('.clay-card').find('button').click();
    cy.contains('Processing...').should('be.visible');
    cy.get('button').contains('Processing...').should('be.disabled');
  });

  it('handles achievement workflow with auto-delete enabled', () => {
    cy.contains('Settings').click();
    cy.get('#auto-delete').click();

    cy.intercept('POST', '/api/achievements/pull-shark', {
      statusCode: 200,
      body: {
        success: true,
        repository: 'https://github.com/testuser/repo-pull-shark-123',
        pullRequest: 'https://github.com/testuser/repo-pull-shark-123/pull/1',
        deleted: true,
        message: 'Pull request created, merged, and repository deleted successfully',
      },
    }).as('pullSharkDelete');

    cy.contains('Pull Shark').parents('.clay-card').find('button').click();
    cy.wait('@pullSharkDelete');
    cy.contains('repository deleted successfully').should('be.visible');
  });

  it('displays error message on workflow failure', () => {
    cy.intercept('POST', '/api/achievements/pull-shark', {
      statusCode: 500,
      body: {
        error: 'Failed to automate Pull Shark achievement',
        message: 'API rate limit exceeded',
      },
    }).as('pullSharkError');

    cy.contains('Pull Shark').parents('.clay-card').find('button').click();
    cy.wait('@pullSharkError');
    cy.contains('Error').should('be.visible');
  });
});
