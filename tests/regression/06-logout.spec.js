
const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');

const loginData = require('../../test-data/loginData.json');

test('Logout and verify session invalidation', async ({ page }) => {

    const loginPage = new LoginPage(page);

    // STEP 1: Open OrangeHRM
    await page.goto('/');

    // STEP 2: Login
    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    // STEP 3: Verify successful login
    await loginPage.verifyLoginSuccessful();

    console.log('Login successful');

    // STEP 4: Logout
    await loginPage.logout();

    console.log('Logout successful');

    // STEP 5: Try accessing the dashboard directly
    await page.goto('/web/index.php/dashboard/index');

    // STEP 6: Verify user is redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/);

    console.log('Session invalidation verified successfully');
});
