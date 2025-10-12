import React from 'react';
import { AchievementCard } from '../../components/achievement-card';

describe('AchievementCard Component', () => {
  it('renders achievement card with all properties', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        icon="🦈"
        tier="Default"
        progress={5}
        target={16}
        status="in_progress"
        onClick={() => {}}
      />
    );

    cy.contains('Pull Shark').should('be.visible');
    cy.contains('Merge pull requests').should('be.visible');
    cy.contains('🦈').should('be.visible');
    cy.contains('5 / 16').should('be.visible');
  });

  it('shows completed state correctly', () => {
    cy.mount(
      <AchievementCard
        title="Quickdraw"
        description="Close issues fast"
        icon="⚡"
        tier="Default"
        progress={10}
        target={10}
        status="completed"
        onClick={() => {}}
      />
    );

    cy.contains('Completed').should('be.visible');
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow', '100');
  });

  it('shows locked state correctly', () => {
    cy.mount(
      <AchievementCard
        title="YOLO"
        description="Direct commits"
        icon="🎯"
        tier="Default"
        progress={0}
        target={8}
        status="locked"
        onClick={() => {}}
      />
    );

    cy.contains('Locked').should('be.visible');
  });

  it('calls onClick when fetch button is clicked', () => {
    const onClickSpy = cy.spy().as('onClickSpy');

    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        icon="🦈"
        tier="Default"
        progress={0}
        target={16}
        status="locked"
        onClick={onClickSpy}
      />
    );

    cy.contains('Fetch Achievement').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('shows loading state correctly', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        icon="🦈"
        tier="Default"
        progress={0}
        target={16}
        status="in_progress"
        onClick={() => {}}
        isLoading={true}
      />
    );

    cy.contains('Processing...').should('be.visible');
    cy.get('button').should('be.disabled');
  });

  it('displays progress bar correctly', () => {
    cy.mount(
      <AchievementCard
        title="Pull Shark"
        description="Merge pull requests"
        icon="🦈"
        tier="Default"
        progress={8}
        target={16}
        status="in_progress"
        onClick={() => {}}
      />
    );

    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow', '50');
  });
});
