import './commands';
import '@testing-library/cypress/add-commands';
import '../../app/globals.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

import { mount } from 'cypress/react';

Cypress.Commands.add('mount', mount);

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});
