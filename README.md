# A transaction case study with Cypress and TypeScript

An independent educational QA project by [baruth91](https://github.com/baruth91),
shared with the QA community as part of a practical automation learning journey.
It connects a business risk to original tests, repeatable data and inspectable
execution evidence. The first increment contains **three cases**, not a complete
payment-system test suite.

## The quality question

When a demo user sends USD 12 to another demo user, is the intended transaction
persisted, with the sender debited and receiver credited by exactly 1,200 cents?
An optimistic success message alone cannot answer that question.

We also verify that an empty amount prevents submission in the UI and that an
anonymous visitor cannot view the payment form. These are separate checks with
distinct failure meanings.

## What belongs to this repository

The tests, setup scripts, rationale and lessons are original work for this case.
The application under test is the official
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app),
downloaded separately at revision
[`0729f68`](https://github.com/cypress-io/cypress-realworld-app/tree/0729f68ac220f7cda4ad09c5693dba11d7c532c6).
It is MIT licensed. Its source and upstream test suite are not republished as our
portfolio work. See [attribution](THIRD_PARTY.md).

## Quick start

Requirements: Git, Node.js **22.23.2** (see `.nvmrc`), npm, Google Chrome and internet access for
the initial downloads. Ports **3000 and 3001 must be free**. The application has a
large dependency tree; the first setup takes longer than subsequent runs.

```powershell
git clone https://github.com/baruth91/cypress-typescript-qa-case-study.git
cd cypress-typescript-qa-case-study
npm ci
npm run app:prepare
npm run typecheck
npm test
```

`app:prepare` downloads the pinned application into ignored `.work/rwa` and installs
its dependencies with its frozen Yarn lockfile. `npm test` starts the app, waits
for both HTTP endpoints, runs our tests in installed Chrome and stops the processes it
started. No paid Cypress Cloud account or recording key is needed.

The tests use localhost only. They reset the demo database before every scenario.
Do not repoint them at a shared, hosted or real payment environment. The public
synthetic password `s3cret` belongs to the upstream demo seed; no personal account
or real payment information is used.

## Watch and explore

In one terminal, start the application:

```powershell
npm run app:start
```

In a second terminal, open the Cypress interactive runner:

```powershell
npm run cy:open
```

Select E2E testing, a supported installed browser and `transaction.cy.ts`.
Close the runner and stop the app with Ctrl+C when finished. For the verified
headless path use `npm test`; additional interactive browsers are not implicitly
validated by a Chrome run.

## Cases and assertions

| ID | Risk | Observable evidence |
| --- | --- | --- |
| PAY-01 | A success notification hides wrong or missing payment data | UI submission, HTTP request/response, authenticated detail read, exact amount/participants/status, both persisted balances, one matching record |
| PAY-02 | An incomplete form allows submission | Required-amount error and disabled payment button |
| AUTH-01 | An anonymous user can reach the payment form | Redirect to sign-in, visible sign-in control, absent payment form |

PAY-01's record count is evidence about this single click. It does not establish
idempotency under retries or double clicks. PAY-02 checks UI validation, not API
input validation. AUTH-01 checks routing, not a complete authorization boundary.

## Read the code in this order

1. [`docs/case-study.md`](docs/case-study.md): risks, hypotheses and coverage.
2. [`cypress/e2e/transaction.cy.ts`](cypress/e2e/transaction.cy.ts): business assertions.
3. [`cypress/support/demo.ts`](cypress/support/demo.ts): reset, typed data and login setup.
4. [`cypress.config.ts`](cypress.config.ts): isolation, diagnostics and no automatic retries.
5. [`docs/learning-guide.md`](docs/learning-guide.md): guided lesson and exercise.
6. [`docs/validation.md`](docs/validation.md): actual results and limitations.

The code uses Cypress's command queue and small functions rather than translating
the previous Python page objects mechanically. TypeScript checks the test code;
runtime assertions check the data actually returned by the application.

## Reproduce in the cloud

Open the repository's **Actions** tab, choose **Cypress transaction case checks**
and select **Run workflow** on `main`. The job starts the pinned app inside the
runner; it does not depend on a public demo URL or human-verification challenge.
Pushes and pull requests also trigger it.

JUnit XML is written to `reports/`, videos to `cypress/videos/`, and failure
screenshots to `cypress/screenshots/`. GitHub retains the evidence artifact for
seven days. Review [validation](docs/validation.md) before claiming a passing run.

## Teaching and contributions

For each scenario, explain the risk, expected result, data preconditions and the
limits of a pass. Try the exercise in the learning guide and explain the resulting
failure before changing the code. Questions and small improvements are welcome;
see [contribution guidance](CONTRIBUTING.md).

Related case: [Playwright and Python shopping journey](https://github.com/baruth91/playwright-python-qa-case-study).
The different environments and APIs are part of the learning comparison.
