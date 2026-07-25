import React from 'react';
import { ActivityLog } from '../../components/activity-log';
import type { LogEntry } from '../../lib/storage';

const mockLogs: LogEntry[] = [
  {
    id: '1',
    level: 'success',
    message: 'Achievement fetched successfully',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '2',
    level: 'error',
    message: 'Fetch failed: repository already exists',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '3',
    level: 'info',
    message: 'Connecting to GitHub API',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: '4',
    level: 'warning',
    message: 'Rate limit approaching',
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
];

const mockLogsWithUrl: LogEntry[] = [
  {
    id: '5',
    level: 'success',
    message: 'Repository created: https://github.com/testuser/test-repo',
    timestamp: new Date().toISOString(),
  },
];

describe('ActivityLog Component', () => {
  it('renders empty state when no logs', () => {
    cy.mount(<ActivityLog logs={[]} onClear={() => {}} />);

    cy.contains('RepoRetriever is waiting for commands.').should('be.visible');
  });

  it('renders all log entries', () => {
    cy.mount(<ActivityLog logs={mockLogs} onClear={() => {}} />);

    cy.contains('Achievement fetched successfully').should('be.visible');
    cy.contains('Fetch failed: repository already exists').should('be.visible');
    cy.contains('Connecting to GitHub API').should('be.visible');
    cy.contains('Rate limit approaching').should('be.visible');
  });

  it('displays correct log level icons and labels', () => {
    cy.mount(<ActivityLog logs={mockLogs} onClear={() => {}} />);

    cy.get('[aria-hidden="true"]').should('have.length.greaterThan', 0);
  });

  it('extracts and links URLs from log messages', () => {
    cy.mount(<ActivityLog logs={mockLogsWithUrl} onClear={() => {}} />);

    cy.get('a[href="https://github.com/testuser/test-repo"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('has accessible link labels for URLs', () => {
    cy.mount(<ActivityLog logs={mockLogsWithUrl} onClear={() => {}} />);

    cy.get('a[href*="github.com"]').should(
      'have.attr',
      'aria-label',
      'Open https://github.com/testuser/test-repo in new tab'
    );
  });

  it('hides decorative terminal prompt from screen readers', () => {
    cy.mount(<ActivityLog logs={[]} onClear={() => {}} />);

    cy.get('[aria-hidden="true"]').contains('>_').should('exist');
  });

  it('calls onClear when clear button is clicked', () => {
    const onClearSpy = cy.spy().as('onClearSpy');

    cy.mount(<ActivityLog logs={mockLogs} onClear={onClearSpy} />);

    cy.contains('Clear Log').click();
    cy.get('@onClearSpy').should('have.been.calledOnce');
  });

  it('hides clear button when no logs exist', () => {
    cy.mount(<ActivityLog logs={[]} onClear={() => {}} />);

    cy.contains('Clear Log').should('not.exist');
  });

  it('renders monospace font for log messages', () => {
    cy.mount(<ActivityLog logs={mockLogs} onClear={() => {}} />);

    cy.get('.font-mono').should('have.length.greaterThan', 0);
  });
});
