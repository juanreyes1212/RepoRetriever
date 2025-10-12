import React from 'react';
import { SettingsPanel } from '../../components/settings-panel';

describe('SettingsPanel Component', () => {
  it('renders settings panel with all sections', () => {
    cy.mount(
      <SettingsPanel
        autoDeleteRepos={false}
        onAutoDeleteChange={() => {}}
        onClearHistory={() => {}}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={5}
        logCount={10}
      />
    );

    cy.contains('Settings').should('be.visible');
    cy.contains('Delete repositories after unlock').should('be.visible');
    cy.contains('Achievement History').should('be.visible');
    cy.contains('Activity Logs').should('be.visible');
  });

  it('toggles auto-delete setting', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <SettingsPanel
        autoDeleteRepos={false}
        onAutoDeleteChange={onChangeSpy}
        onClearHistory={() => {}}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={5}
        logCount={10}
      />
    );

    cy.get('#auto-delete').click();
    cy.get('@onChangeSpy').should('have.been.calledWith', true);
  });

  it('shows warning when auto-delete is enabled', () => {
    cy.mount(
      <SettingsPanel
        autoDeleteRepos={true}
        onAutoDeleteChange={() => {}}
        onClearHistory={() => {}}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={5}
        logCount={10}
      />
    );

    cy.contains('Repositories will be permanently deleted').should('be.visible');
  });

  it('displays correct record counts', () => {
    cy.mount(
      <SettingsPanel
        autoDeleteRepos={false}
        onAutoDeleteChange={() => {}}
        onClearHistory={() => {}}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={15}
        logCount={42}
      />
    );

    cy.contains('15 records stored').should('be.visible');
    cy.contains('42 entries stored').should('be.visible');
  });

  it('disables clear buttons when no data', () => {
    cy.mount(
      <SettingsPanel
        autoDeleteRepos={false}
        onAutoDeleteChange={() => {}}
        onClearHistory={() => {}}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={0}
        logCount={0}
      />
    );

    cy.contains('button', 'Clear').should('have.length', 2).each(($btn) => {
      cy.wrap($btn).should('be.disabled');
    });
    cy.contains('Export All Data').should('be.disabled');
  });

  it('shows confirmation dialog before clearing history', () => {
    const onClearSpy = cy.spy().as('onClearSpy');

    cy.mount(
      <SettingsPanel
        autoDeleteRepos={false}
        onAutoDeleteChange={() => {}}
        onClearHistory={onClearSpy}
        onClearLogs={() => {}}
        onExportData={() => {}}
        historyCount={5}
        logCount={10}
      />
    );

    cy.contains('Achievement History').parent().find('button').click();
    cy.contains('Clear achievement history?').should('be.visible');
    cy.contains('button', 'Clear History').click();
    cy.get('@onClearSpy').should('have.been.calledOnce');
  });
});
