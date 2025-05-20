const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173',
    env: {
      // This issue persisted when trying to use port 3003: https://github.com/cypress-io/cypress/issues/25397
      // In Vite server, we use a proxy for the backend port, so this is a workaround
      BACKEND: 'http://localhost:5173/api'
    }
  },
});
