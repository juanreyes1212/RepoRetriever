import React from 'react';
import { AchievementHistory } from '../../components/achievement-history';
import type { AchievementRecord } from '../../lib/storage';

const mockHistory: AchievementRecord[] = [
  {
    id: '1',
    achievementType: 'pull_shark',
    status: 'success',
    repositoryUrl: 'https://github.com/testuser/repo-1',
    pullRequestUrls: ['https://github.com/testuser/repo-1/pull/1'],
    durationSeconds: 25,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    achievementType: 'quickdraw',
    status: 'success',
    repositoryUrl: 'https://github.com/testuser/repo-2',
    issueUrl: 'https://github.com/testuser/repo-2/issues/1',
    durationSeconds: 8,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    achievementType: 'yolo',
    status: 'failed',
    errorMessage: 'Repository creation failed',
    durationSeconds: 3,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

describe('AchievementHistory Component', () => {
  it('renders empty state when no history', () => {
    cy.mount(<AchievementHistory history={[]} />);

    cy.contains('No fetches yet. Send RepoRetriever to work above!').should('be.visible');
  });

  it('renders all history records', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.contains('Pull Shark').should('be.visible');
    cy.contains('Quickdraw').should('be.visible');
    cy.contains('YOLO').should('be.visible');
  });

  it('shows success and failed status badges', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.contains('success').should('be.visible');
    cy.contains('failed').should('be.visible');
  });

  it('displays error messages for failed fetches', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.contains('Error: Repository creation failed').should('be.visible');
  });

  it('links to repository URLs with proper accessibility', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.get('a[href="https://github.com/testuser/repo-1"]')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
      .and('have.attr', 'aria-label', 'View repository for Pull Shark (opens in new tab)');
  });

  it('links to issue URLs with proper accessibility', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.get('a[href="https://github.com/testuser/repo-2/issues/1"]')
      .should('have.attr', 'aria-label', 'View issue for Quickdraw (opens in new tab)');
  });

  it('links to pull request URLs with proper accessibility', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.get('a[href="https://github.com/testuser/repo-1/pull/1"]')
      .should('have.attr', 'aria-label', 'View pull request 1 (opens in new tab)');
  });

  it('hides achievement emojis from screen readers', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.get('[aria-hidden="true"]').contains('🦈').should('exist');
    cy.get('[aria-hidden="true"]').contains('⚡').should('exist');
    cy.get('[aria-hidden="true"]').contains('🎯').should('exist');
  });

  it('shows summary counts in description', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.contains('2 successful fetches, 1 failed').should('be.visible');
  });

  it('hides decorative empty state prompt from screen readers', () => {
    cy.mount(<AchievementHistory history={[]} />);

    cy.get('[aria-hidden="true"]').contains('>_').should('exist');
  });

  it('formats duration correctly', () => {
    cy.mount(<AchievementHistory history={mockHistory} />);

    cy.contains('25s').should('be.visible');
    cy.contains('8s').should('be.visible');
    cy.contains('3s').should('be.visible');
  });
});
