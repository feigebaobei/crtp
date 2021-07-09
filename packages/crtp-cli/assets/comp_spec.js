describe('button', () => {
    it('for test', () => {
        cy.wrap({ a: 0 }).its('a').should('eq', 0);
    });
});
