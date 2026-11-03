
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({

    testDir: './tests',

    timeout: 180000,

    expect: {
        timeout: 10000
    },

    fullyParallel: false,
    workers: 1,

    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    use: {
        baseURL: 'https://opensource-demo.orangehrmlive.com',
        browserName: 'chromium',

        // Headless in GitHub Actions, headed locally
        headless: !!process.env.CI,

        screenshot: 'only-on-failure',
        video: 'on',
        trace: 'retain-on-failure'
    }
});
