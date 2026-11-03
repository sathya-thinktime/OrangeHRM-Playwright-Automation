
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({

    // Location of test files
    testDir: './tests',

    // Maximum test execution time: 3 minutes
    timeout: 180000,

    // Assertion timeout
    expect: {
        timeout: 10000
    },

    // Execute tests sequentially
    fullyParallel: false,
    workers: 1,

    // HTML report
    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    // Browser configuration
    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'on',
        trace: 'retain-on-failure'
    }
});
