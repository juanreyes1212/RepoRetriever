describe('Page Accessibility', () => {
  it('has a skip to content link', () => {
    cy.visit('/');
    cy.get('a[href="#main-content"]')
      .should('exist')
      .and('have.text', 'Skip to content');
  });

  it('main content has matching id for skip link target', () => {
    cy.visit('/');
    cy.get('#main-content').should('exist').and('be.visible');
  });

  it('has proper heading hierarchy', () => {
    cy.visit('/');
    cy.get('h1').should('have.length', 1);
    cy.get('h2').should('have.length.greaterThan', 0);
  });

  it('hides decorative emojis from screen readers on landing page', () => {
    cy.visit('/');
    cy.get('[aria-hidden="true"]').contains('🦈').should('exist');
    cy.get('[aria-hidden="true"]').contains('⚡').should('exist');
    cy.get('[aria-hidden="true"]').contains('🎯').should('exist');
  });

  it('has accessible sign in button', () => {
    cy.visit('/');
    cy.get('button[aria-label="Sign in with GitHub"]').should('exist');
  });

  it('footer links have correct accessibility attributes', () => {
    cy.visit('/');
    cy.get('a[href="https://docs.github.com/en/rest"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
    cy.get('a[href="https://github.com/settings/applications"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('page has correct document title', () => {
    cy.visit('/');
    cy.title().should('include', 'RepoRetriever');
  });

  it('html element has lang attribute', () => {
    cy.visit('/');
    cy.get('html').should('have.attr', 'lang', 'en');
  });

  it('html element has dark class', () => {
    cy.visit('/');
    cy.get('html').should('have.class', 'dark');
  });

  it('skip link becomes visible on focus', () => {
    cy.visit('/');
    cy.get('a[href="#main-content"]')
      .focus()
      .should('be.visible');
  });

  it('skip link moves focus to main content on click', () => {
    cy.visit('/');
    cy.get('a[href="#main-content"]').click();
    cy.focused().should('have.attr', 'id', 'main-content');
  });
});
