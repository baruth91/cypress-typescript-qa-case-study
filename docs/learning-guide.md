# Learn the case and demonstrate it

## Lesson 1 — define success before clicking

Read the case study. Explain why a green notification does not prove a correct
payment. Identify the sender, receiver, amount, initial balances and expected
persisted changes. State what this single scenario cannot prove.

## Lesson 2 — prepare a controlled environment

Run `npm ci`, `npm run app:prepare`, `npm run typecheck` and `npm test`.
Explain the separate roles of Node, npm, TypeScript, Cypress, the frontend and API.
Explain why the upstream SHA and both lockfiles matter. The ignored application
checkout retains its own MIT license; it is not our original application code.

## Lesson 3 — follow the Cypress queue

Open `transaction.cy.ts`. Commands enqueue work; values from a request are read
inside `.then()`. Do not treat `cy.request()` as a synchronous response value.
The `@scenario` alias contains the fresh users for this test, not shared state
from a previously executed case.

Read `resetAndLoadUsers()` and explain why TypeScript's DemoUser interface alone
does not validate JSON. Identify the runtime precondition assertions.

## Lesson 4 — distinguish setup, action and oracle

Setup resets the database, reads users and signs in through the demo's intentional
state-machine test hook, which makes the real login request. The action
selects a recipient, fills the form and submits through the UI. The oracle checks
the request, persisted transaction, exact balance changes and record count.

The first transaction is a payment, not an external bank transfer. Only synthetic
demo balances move. Use the form interactively to understand the UI before
presenting the automated run.

## Lesson 5 — investigate a controlled failure

On a temporary branch, change the expected cents from 1200 to 1201 and run only
PAY-01 through the interactive runner. Observe the mismatch, screenshot/video
and assertion output. Explain why that is a test-expectation error. Restore the
change before committing.

Screenshots are saved on failure; videos are recorded during headless runs.
JUnit reports contain machine-readable results. These are different evidence
formats, not additional test coverage.

## Exercise — make a small independent change

Create a temporary variation for USD 7 with an independently stated expectation
of 700 cents. Update both intent and assertions, run it and explain the balance
oracle. Do not change upstream application code to make the check pass.

Suggested solution: keep all original participant, persistence and balance
assertions, change the amount constants and use a distinct synthetic note. This
exercise does not add rounding or insufficient-funds coverage.

## Ten-minute demonstration

1. Explain the risk and boundary (two minutes).
2. Show one transaction and its code (four minutes).
3. Explain database reset and programmatic login (two minutes).
4. Show CI results and one diagnostic artifact (two minutes).

Checkpoint: make a small change independently, explain a failure and describe
the limits of the evidence before turning the example into a training lesson.
