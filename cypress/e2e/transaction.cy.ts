import {
  API, DemoTransaction, DemoUser, Scenario,
  openPaymentForm, resetAndLoadUsers, signInProgrammatically,
} from '../support/demo';

describe('A demo payment with a persisted business outcome', () => {
  beforeEach(() => {
    resetAndLoadUsers().as('scenario');
  });

  it('PAY-01: persists one payment and transfers the exact amount between users', () => {
    cy.get<Scenario>('@scenario').then(({ sender, receiver }) => {
      const payment = { amountDollars: 12, amountCents: 1200, note: 'QA learning payment' };
      expect(sender.balance).to.be.at.least(payment.amountCents);
      signInProgrammatically(sender);
      openPaymentForm(receiver);
      cy.intercept('POST', `${API}/transactions`).as('payment');
      cy.get('[data-test="transaction-create-amount-input"] input')
        .type(String(payment.amountDollars));
      cy.get('[data-test="transaction-create-description-input"] input').type(payment.note);
      cy.get('[data-test="transaction-create-submit-payment"]').should('be.enabled').click();

      cy.wait('@payment').then(({ request, response }) => {
        expect(request.body.receiverId).to.equal(receiver.id);
        expect(Number(request.body.amount)).to.equal(payment.amountDollars);
        expect(response?.statusCode).to.equal(200);
        const created: DemoTransaction = response!.body.transaction;
        expect(created.id).to.be.a('string').and.not.be.empty;
        cy.request<{ transaction: DemoTransaction }>(`${API}/transactions/${created.id}`)
          .then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body.transaction).to.include({
              id: created.id, senderId: sender.id, receiverId: receiver.id,
              amount: payment.amountCents, description: payment.note, status: 'complete',
            });
          });
      });
      cy.get('[data-test="alert-bar-success"]').should('contain.text', 'Transaction Submitted!');
      cy.request<{ results: DemoUser[] }>(`${API}/testData/users`).then(({ body }) => {
        expect(body.results.find((user) => user.id === sender.id)?.balance)
          .to.equal(sender.balance - payment.amountCents);
        expect(body.results.find((user) => user.id === receiver.id)?.balance)
          .to.equal(receiver.balance + payment.amountCents);
      });
      cy.request<{ results: DemoTransaction[] }>(`${API}/testData/transactions`).then(({ body }) => {
        const matching = body.results.filter((transaction) => transaction.description === payment.note);
        expect(matching, 'exactly one matching persisted record from this click').to.have.length(1);
      });
    });
  });

  it('PAY-02: prevents submission when the payment amount is empty', () => {
    cy.get<Scenario>('@scenario').then(({ sender, receiver }) => {
      signInProgrammatically(sender);
      openPaymentForm(receiver);
      cy.get('[data-test="transaction-create-amount-input"] input').type('12').clear().blur();
      cy.get('[data-test="transaction-create-description-input"] input').type('Incomplete payment');
      cy.contains('Please enter a valid amount').should('be.visible');
      cy.get('[data-test="transaction-create-submit-payment"]').should('be.disabled');
    });
  });

  it('AUTH-01: redirects an anonymous visitor away from the payment form', () => {
    cy.visit('/transaction/new');
    cy.location('pathname').should('equal', '/signin');
    cy.get('[data-test="signin-submit"]').should('be.visible');
    cy.get('[data-test="transaction-create-form"]').should('not.exist');
  });
});
