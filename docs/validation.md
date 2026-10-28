# Validation record

The first increment contains three original cases: PAY-01, PAY-02 and AUTH-01.
The official demo is pinned in `upstream.json` and is downloaded separately.

## Baseline

- Local target: Windows, Node 22.23.2, Cypress 16.1.1, TypeScript 5.8.3.
- Browser target: installed Chrome (local 156.0.8078.47).
- CI target: Ubuntu 24.04, the same Node version and test dependencies.
- Frontend: localhost:3000; API: localhost:3001.
- Test data: reset synthetic demo users and balances before each case.
- TypeScript check: `npm run typecheck` passed during initial implementation.

Local execution on 2026-10-28: **3 passed, 0 failed, 0 pending, 0 skipped**;
Final JUnit suite duration 7.003 seconds. The complete npm command also started both
services and exited successfully after cleanup. `npm run typecheck` passed.
The original test-dependency installation reported zero npm audit vulnerabilities;
this is not an audit of the separately installed upstream application.

## Implementation findings

- Direct API login produced a server session but left the demo's XState UI
  unauthorized. The test now uses its intentional authService hook to establish
  both states, with a real request and explicit assertions.
- The initial start-server-and-test 2.x cleanup used wmic.exe, absent on this
  Windows installation. Version 3.0.13 uses tree-kill and cleaned up successfully.
- Cypress 16.1.1 warns that Electron testing is deprecated. Chrome is the verified
  target; no claim is made about Firefox or Edge.
- Upstream emits dependency/React deprecation warnings. No blanket exception
  suppression or modifications to upstream source were used to make tests pass.

The hosted CI result will be recorded after execution. A configured workflow alone
is not a passing CI result.
