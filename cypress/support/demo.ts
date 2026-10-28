export const API = 'http://localhost:3001';

export interface DemoUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  balance: number;
}

export interface DemoTransaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  status: string;
}

export interface Scenario {
  sender: DemoUser;
  receiver: DemoUser;
}

export function resetAndLoadUsers(): Cypress.Chainable<Scenario> {
  return cy.request('POST', `${API}/testData/seed`).then((response) => {
    expect(response.status).to.equal(200);
    return cy.request<{ results: DemoUser[] }>(`${API}/testData/users`);
  }).then(({ body }) => {
    // TypeScript annotations do not validate incoming JSON. Check our preconditions.
    expect(body.results).to.be.an('array').and.have.length.of.at.least(2);
    const [sender, receiver] = body.results;
    for (const user of [sender, receiver]) {
      expect(user.id).to.be.a('string').and.not.be.empty;
      expect(user.username).to.be.a('string').and.not.be.empty;
      expect(user.balance).to.be.a('number');
    }
    expect(sender.id).not.to.equal(receiver.id);
    return { sender, receiver };
  });
}

declare global {
  interface Window {
    authService: {
      send(event: 'LOGIN', credentials: { username: string; password: string }): void;
    };
  }
}

export function signInProgrammatically(user: DemoUser): void {
  // Use the demo's intentional test hook: it updates both cookie and UI state.
  // A direct API login alone leaves its XState UI unauthorized.
  cy.intercept('POST', `${API}/login`).as('login');
  cy.visit('/signin');
  cy.window().its('authService').should('exist');
  cy.window().then((win) => {
    // Public upstream synthetic seed password, not a real credential.
    win.authService.send('LOGIN', { username: user.username, password: 's3cret' });
  });
  cy.wait('@login').then(({ response }) => {
    expect(response?.statusCode).to.equal(200);
    expect(response?.body.user.id).to.equal(user.id);
  });
  cy.location('pathname').should('equal', '/');
}

export function openPaymentForm(receiver: DemoUser): void {
  cy.intercept('GET', `${API}/users*`).as('users');
  cy.visit('/transaction/new');
  cy.wait('@users').its('response.statusCode').should('equal', 200);
  cy.get(`[data-test="user-list-item-${receiver.id}"]`).should('be.visible').click();
  cy.get('[data-test="transaction-create-form"]').should('be.visible');
}
