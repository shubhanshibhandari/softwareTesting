// cypress/integration/app.spec.js
describe('End-to-End Test', () => {
    it('should display books on the frontend', () => {
      cy.visit('http://localhost:5173'); // Replace with your actual frontend URL
      cy.get('.book').should('have.length', 2); // Assuming books are displayed with class 'book'
      cy.contains('Book 1').should('exist');
      cy.contains('Book 2').should('exist');
    });
  });