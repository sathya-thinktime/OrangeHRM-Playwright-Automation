
const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { APIHelper } = require('../../utils/APIHelper');

const loginData = require('../../test-data/loginData.json');

test('OrangeHRM API - Retrieve Employee List', async ({ page, request }) => {

    test.setTimeout(120000);

    // 1. Initialize Page Objects and API Helper
    const loginPage = new LoginPage(page);
    const api = new APIHelper(request);

    // 2. Login to OrangeHRM
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    console.log('OrangeHRM UI login successful');

    // 3. Authenticate with OrangeHRM API
    await api.authorizeAndGetToken(page);

    console.log('OrangeHRM API authentication successful');

    // 4. Retrieve Employee List through API
    const employeesResponse = await api.getEmployees();

    expect(employeesResponse.status()).toBe(200);

    const employeesData = await employeesResponse.json();

    // 5. Validate API response
    expect(employeesData.data).toBeDefined();
    expect(Array.isArray(employeesData.data)).toBeTruthy();

    console.log('Employee list API validation successful');
    console.log('Total employees returned:', employeesData.data.length);

    // 6. Verify response structure
    if (employeesData.data.length > 0) {

        const employee = employeesData.data[0];

        expect(employee).toHaveProperty('empNumber');
        expect(employee).toHaveProperty('firstName');
        expect(employee).toHaveProperty('lastName');

        console.log('Employee response structure validated');
    }

    console.log('OrangeHRM API test completed successfully');
});
