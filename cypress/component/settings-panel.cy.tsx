import React from 'react';
import { SettingsPanel } from '../../components/settings-panel';

describe('SettingsPanel Component', () => {
  const defaultProps = {
    autoDeleteRepos: false,
    onAutoDeleteChange: () => {},
    onClearHistory: () => {},
    onClearLogs: () => {},
    onExportData: () => {},
    historyCount: 5,
    logCount: 10,
  };

  it('renders settings panel with all sections', () => {
    cy.mount(<SettingsPanel {...defaultProps} />);

    cy.contains('Settings').should('be.visible');
    cy.contains('Delete repositories after unlock').should('be.visible');
    cy.contains('Achievement History').should('be.visible');
    cy.contains('Activity Logs').should('be.visible');
  });

  it('toggles auto-delete setting', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.mount(
      <SettingsPanel
        {...defaultProps}
        onAutoDeleteChange={onChangeSpy}
      />
    );

    cy.get('#auto-delete').click();
    cy.get('@onChangeSpy').should('have.been.calledWith', true);
  });

  it('shows warning when auto-delete is enabled', () => {
    cy.mount(
      <SettingsPanel
        {...defaultProps}
        autoDeleteRepos={true}
      />
    );

    cy.contains('Repositories will be permanently deleted').should('be.visible');
  });

  it('displays correct record counts', () => {
    cy.mount(
      <SettingsPanel
        {...defaultProps}
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
        {...defaultProps}
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
        {...defaultProps}
        onClearHistory={onClearSpy}
      />
    );

    cy.contains('Achievement History').parent().find('button').click();
    cy.contains('Clear achievement history?').should('be.visible');
    cy.contains('button', 'Clear History').click();
    cy.get('@onClearSpy').should('have.been.calledOnce');
  });

  it('has accessible labels on clear buttons', () => {
    cy.mount(<SettingsPanel {...defaultProps} />);

    cy.get('button[aria-label="Clear achievement history"]').should('exist');
    cy.get('button[aria-label="Clear activity logs"]').should('exist');
  });

  it('has accessible label on export button', () => {
    cy.mount(<SettingsPanel {...defaultProps} />);

    cy.get('button[aria-label="Export all data as JSON"]').should('exist');
  });

  it('hides decorative icons from screen readers', () => {
    cy.mount(<SettingsPanel {...defaultProps} />);

    cy.get('svg[aria-hidden="true"]').should('have.length.greaterThan', 0);
  });

  it('has proper label association for switch', () => {
    cy.mount(<SettingsPanel {...defaultProps} />);

    cy.get('#auto-delete').should('exist');
    cy.get('label[for="auto-delete"]').should('exist');
  });
});
