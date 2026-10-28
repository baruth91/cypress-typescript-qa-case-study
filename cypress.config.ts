import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  retries: 0,
  reporter: 'junit',
  reporterOptions: { mochaFile: 'reports/junit.xml', toConsole: false },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1440,
    viewportHeight: 1000,
    testIsolation: true,
    setupNodeEvents(_on, config) {
      // These tests reset server data. Keep the entire exercise on loopback.
      if (config.baseUrl !== 'http://localhost:3000') {
        throw new Error('This destructive seed-data exercise only supports the local demo.');
      }
      return config;
    },
  },
});
