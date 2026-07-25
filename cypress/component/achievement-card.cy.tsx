import React from 'react';
import { AchievementCard } from '../../components/achievement-card';

describe('AchievementCard Component', () => {
  it('renders achievement card with all properties', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={() => {}}
        estimatedTime="~20-30s"
        requirements="2 PRs"
      />
    );

    cy.contains('Pull Shark').should('be.visible');
    cy.contains('Merge pull requests').should('be.visible');
    cy.contains('🦴').should('be.visible');
    cy.contains('~20-30s').should('be.visible');
    cy.contains('2 PRs').should('be.visible');
  });

  it('shows idle state correctly', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={() => {}}
      />
    );

    cy.contains('Ready').should('be.visible');
    cy.contains('Fetch Achievement').should('be.visible');
  });

  it('shows in_progress state with progress bar', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="in_progress"
        progress={50}
        onUnlock={() => {}}
      />
    );

    cy.contains('Running').should('be.visible');
    cy.contains('Fetching: 50%').should('be.visible');
    cy.get('[role="progressbar"]')
      .should('have.attr', 'aria-valuenow', '50')
      .and('have.attr', 'aria-valuemin', '0')
      .and('have.attr', 'aria-valuemax', '100')
      .and('have.attr', 'aria-label', 'Pull Shark fetch progress');
  });

  it('shows success state correctly', () => {
    cy.mount(
      <AchievementCard
        title="Quickdraw"
        description="Close issues fast"
        emoji="🥏"
        status="success"
        progress={100}
        onUnlock={() => {}}
      />
    );

    cy.contains('Complete').should('be.visible');
  });

  it('shows error state with try again button', () => {
    cy.mount(
      <AchievementCard
        title="YOLO"
        description="Direct commits"
        emoji="🎾"
        status="error"
        progress={0}
        onUnlock={() => {}}
      />
    );

    cy.contains('Failed').should('be.visible');
    cy.contains('Try Again').should('be.visible');
  });

  it('calls onUnlock when fetch button is clicked', () => {
    const onUnlockSpy = cy.spy().as('onUnlockSpy');

    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={onUnlockSpy}
      />
    );

    cy.contains('Fetch Achievement').click();
    cy.get('@onUnlockSpy').should('have.been.calledOnce');
  });

  it('disables button when in progress', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="in_progress"
        progress={50}
        onUnlock={() => {}}
      />
    );

    cy.get('button').should('be.disabled');
    cy.contains('Fetching...').should('be.visible');
  });

  it('disables button when disabled prop is true', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={() => {}}
        disabled={true}
      />
    );

    cy.get('button').should('be.disabled');
  });

  it('hides emoji from screen readers', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={() => {}}
      />
    );

    cy.get('[aria-hidden="true"]').contains('🦴').should('exist');
  });

  it('has accessible button label', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="idle"
        progress={0}
        onUnlock={() => {}}
      />
    );

    cy.get('button').should('have.attr', 'aria-label', 'Fetch Pull Shark achievement');
  });

  it('announces progress with aria-live', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        emoji="🦴"
        status="in_progress"
        progress={50}
        onUnlock={() => {}}
      />
    );

    cy.get('[aria-live="polite"]').should('contain', 'Fetching: 50%');
  });
});
