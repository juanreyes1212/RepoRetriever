describe('Settings Management', () => {
  beforeEach(() => {
    cy.mockGitHubAuth();
    cy.visit('/');
  });

  it('navigates to settings panel', () => {
    cy.contains('Settings').should('be.visible').click();
    cy.contains('Delete repositories after unlock').should('be.visible');
  });

  it('toggles auto-delete setting and persists', () => {
    cy.contains('Settings').click();
    cy.get('#auto-delete').click();

    cy.reload();
    cy.contains('Settings').click();
    cy.get('#auto-delete').should('be.checked');
  });

  it('shows warning when enabling auto-delete', () => {
    cy.contains('Settings').click();
    cy.get('#auto-delete').click();
    cy.contains('Repositories will be permanently deleted').should('be.visible');
  });

  it('clears achievement history with confirmation', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('achievementHistory', JSON.stringify([
        { id: '1', type: 'pull_shark', timestamp: Date.now() },
      ]));
    });

    cy.reload();
    cy.contains('Settings').click();
    cy.contains('Achievement History').parent().find('button').contains('Clear').click();
    cy.contains('Clear achievement history?').should('be.visible');
    cy.contains('button', 'Clear History').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('achievementHistory')).to.equal('[]');
    });
  });

  it('exports data successfully', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('achievementHistory', JSON.stringify([
        { id: '1', type: 'pull_shark', timestamp: Date.now() },
      ]));
      win.localStorage.setItem('activityLog', JSON.stringify([
        { id: '1', action: 'test', timestamp: Date.now() },
      ]));
    });

    cy.reload();
    cy.contains('Settings').click();
    cy.contains('Export All Data').click();
  });

  it('disables export when no data available', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('achievementHistory', '[]');
      win.localStorage.setItem('activityLog', '[]');
    });

    cy.reload();
    cy.contains('Settings').click();
    cy.contains('Export All Data').should('be.disabled');
  });
});
