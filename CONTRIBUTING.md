# Contributing

Keep code, documentation and test names in English. Explain the risk and expected
outcome before adding a scenario. Use synthetic data and the local demo only.
Run `npm run typecheck` and `npm test`, and describe the exact result in your change.

Prefer small functions, independent scenarios and observable assertions. Do not
add fixed delays, forced clicks, blanket exception handlers or automatic retries
to conceal failures. Separate real backend checks from intentionally stubbed
examples. Record limitations and attribute application code accurately.
