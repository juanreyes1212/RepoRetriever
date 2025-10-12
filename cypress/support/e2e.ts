import './commands';
import '@testing-library/cypress/add-commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});
