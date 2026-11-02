
const { test } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { EmployeeListPage } = require('../pages/EmployeeListPage');

const loginData = require('../test-data/loginData.json');
const generatedData = require('../test-data/generatedEmployee.json');

test('Search and verify created employee', async ({ page }) => {

    // Step 1: Initialize Page Objects
    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // Step 2: Login
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    // Step 3: Navigate to Employee List
    await employeeListPage.navigateToEmployeeList();

    // Step 4: Search using generated Employee ID
    await employeeListPage.searchEmployee(
        generatedData.employee.employeeId
    );

    // Step 5: Verify employee details
    await employeeListPage.verifyEmployeeDisplayed(
        generatedData.employee.firstName,
        generatedData.employee.lastName
    );

    console.log(
        'Employee search successful. Employee ID:',
        generatedData.employee.employeeId
    );
});
