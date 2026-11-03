
const { test } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');

const loginData = require('../../test-data/loginData.json');

test('Search and verify created employee', async ({ page }) => {

    // // Step 1: Load generated employee data
    // const generatedData = require('../../test-data/generatedEmployee.json');

    // Step 2: Initialize Page Objects
    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // Step 3: Login
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    // Step 4: Navigate to Employee List
    await employeeListPage.navigateToEmployeeList();

    // Step 5: Search using generated Employee ID
    await employeeListPage.searchEmployee(
        generatedData.employee.employeeId
    );

    // Step 6: Verify employee details
    await employeeListPage.verifyEmployeeDisplayed(
        generatedData.employee.firstName,
        generatedData.employee.lastName
    );

    console.log(
        'Employee search successful. Employee ID:',
        generatedData.employee.employeeId
    );
});
