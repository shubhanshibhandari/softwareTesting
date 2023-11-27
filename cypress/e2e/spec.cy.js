// cypress/integration/app.spec.js
describe('End-to-End Test', () => {
  it('Display home page , check tables, card and add button after that check size of table and click on info icon , then check book detail page and come back to home page', () => {
    cy.visit('http://localhost:5173'); 

    cy.intercept('GET', 'http://localhost:5555/books').as('getBooks');
    cy.wait('@getBooks');

    
    cy.get('[data-cy="hp_table"]').should('exist');
    cy.get('[data-cy="hp_card"]').should('exist');
    cy.get('[data-cy="hp_head"]').contains('Books List').should('exist');

    cy.get('[data-cy="hp_add"]').should('exist');

    cy.get('[data-cy="booktable"]')
      .contains('th', 'Title') 
      .should('exist');

    cy.get('[data-cy="booktable"]') 
      .find('tbody > tr') 
      .should('have.length.gt', 0);
    

      cy.get('[data-cy="booktable"]') 
      .find('tbody > tr') 
      .should('have.length.gt', 0) 
      .first() 
      .find('td a') 
      .first() 
      .click(); 
    
      cy.url().should('include', '/books/details');

    cy.contains('Show Book').should('exist');
    cy.contains('Id').next().should('not.be.empty');
    cy.contains('Title').next().should('not.be.empty');
    cy.contains('Author').next().should('not.be.empty');
    cy.contains('Publish Year').next().should('not.be.empty');
    cy.contains('Create Time').next().should('not.be.empty');
    cy.contains('Last Update Time').next().should('not.be.empty');

    cy.get('[data-cy="back"]') 
    .click(); 

    cy.url().should('eq', 'http://localhost:5173/');
  });


  it('should navigate from home page to add page and add a book and then delete a book', () => {
    cy.visit('http://localhost:5173'); 

    
    cy.intercept('GET', 'http://localhost:5555/books').as('getBooks');
    cy.wait('@getBooks');

    
    cy.get('[data-cy="hp_add"]') 
      .click(); 

    
    cy.url().should('include', '/books/create');

    cy.get('[data-cy="submit"]') 
    .click(); 
    cy.contains('Error').should('exist');
    
    cy.get('[data-cy="input-title"]').type("cypress");
    cy.get('[data-cy="input-title"]').should('have.value', 'cypress')
    cy.get('[data-cy="input-author"]').type("student");
    cy.get('[data-cy="input-author"]').should('have.value', 'student')
    cy.get('[data-cy="input-year"]').type("2023");
    cy.get('[data-cy="input-year"]').should('have.value', '2023')
    cy.get('[data-cy="submit"]') 
    .click(); 
    cy.contains('Book Created successfully').should('exist'); 
    cy.url().should('eq', 'http://localhost:5173/');
    cy.get('[data-cy="booktable"]') 
      .find('tbody > tr') 
      .should('have.length.gt', 0) 
    
      cy.get('[data-cy="title-data"]').contains('cypress').should('exist');
      cy.get('[data-cy="author-data"]').contains('student').should('exist');
      cy.get('[data-cy="year-data"]').contains('2023').should('exist');

      cy.get('[data-cy="title-data"]').contains('cypress').closest('tr').as('targetedRow');
      cy.get('@targetedRow')
      .find('[data-cy="delete-button"]') 
      .click();

      cy.url().should('include', '/books/delete');
      cy.get('[data-cy="confirm-delete"]').click();
      cy.contains('Book Deleted successfully').should('exist');
      
      cy.get('[data-cy="title-data"]').contains('cypress').should('not.exist');
  });




});