# From payment risk to observable evidence

## Context and first-increment objective

The Cypress Real World App is a synthetic payment demo. We want evidence that
one intentional payment through its UI produces the correct persisted result.
This case is independently authored; upstream examples informed application
exploration but are not presented as our own test suite.

The application revision and dependencies are controlled. The frontend and API
run on the same machine as the test runner, including in GitHub Actions. This
addresses the public-host availability boundary encountered in the earlier
Playwright case.

## Working acceptance hypotheses

The following describe the observed demo contract, not requirements approved by
a real financial product owner:

1. A seeded, signed-in user with sufficient balance can pay a different user.
2. A USD 12 payment is persisted as 1,200 cents with the intended participants and note.
3. The resulting payment is complete; sender and receiver balances change by
   exactly 1,200 cents in opposite directions.
4. One submit click creates exactly one matching persisted record in this scenario.
5. An empty amount produces a visible validation message and disables payment.
6. An unauthenticated visit to the payment route redirects to sign-in.

## Risk and coverage decisions

PAY-01 addresses incorrect or missing persisted payment data, a high-impact risk
in the hypothetical product. It is intentionally a thin integration journey:
prepare data via API, interact through the UI, then verify the recorded outcome.
UI authentication is not the behavior under test, so login uses the demo's
intentional `window.authService` hook. It sends a real login request and updates
the UI state machine. Direct API login alone creates a server cookie but does not
authorize this demo's UI. This explicit coupling is tied to the pinned revision;
the authentication form itself is not covered by the payment test.

PAY-02 focuses on incomplete input. AUTH-01 focuses on anonymous navigation.
Keeping them separate makes failure signals clearer than one long scenario.

The amount is defined as two independently readable constants: 12 dollars and
1,200 cents. This slice does not attempt general decimal conversion or financial
rounding coverage. The baseline must contain two different users, numeric balances
and sufficient sender funds; the test checks these preconditions.

## Oracle and independence

The test calculates expected balances from the captured initial balances and
the explicit expected cents. It does not reuse the application's calculation
function. It reads persisted transaction details through an authenticated API,
and reads local test-data endpoints to inspect balances and record count.
The test-data API is a demo inspection mechanism, not a production API contract.

Database seeding occurs before each test. Fresh browser state alone cannot reset
server state. These cases run serially because they share one local database.
Parallel execution would need separate app/data instances per worker.

## Synchronization

Register intercepts before the associated action, wait on the specific request
alias and then assert user-visible or persisted outcomes. There are no fixed
delays, forced clicks, global exception suppression or automatic test retries.
An intercept observes a real request; it does not stub the backend in this case.

## Exclusions and next increments

Not covered: real money, banking integrations, fraud, compliance, concurrent
payments, duplicate requests, rounding boundaries, API authorization attacks,
negative/zero values, network-failure UX, full accessibility or cross-browser
coverage. A synthetic demo is not a financial-system certification.

Next increments should introduce one stated risk at a time. Candidate lessons
include a separately labelled stubbed error state, API authorization checks,
amount boundaries and a retry/idempotency contract if the application supports one.
