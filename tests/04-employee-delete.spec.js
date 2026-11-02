
const { test } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { EmployeeListPage } = require('../pages/EmployeeListPage');

const loginData = require('../test-data/loginData.json');
const generatedData = require('../test-data/generatedEmployee.json');

test('Delete employee and verify deletion', async ({ page }) => {

    // Step 1: Initialize Page Objects
    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    const employeeId = generatedData.employee.employeeId;

    console.log('Employee ID to be deleted:', employeeId);

    // Step 2: Login
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    // Step 3: Navigate to Employee List
    await employeeListPage.navigateToEmployeeList();

    // Step 4: Search employee using generated Employee ID
    await employeeListPage.searchEmployee(employeeId);

    // Step 5: Verify employee exists before deletion
    await employeeListPage.verifyEmployeeDisplayed(
        generatedData.employee.firstName,
        generatedData.employee.lastName
    );

    console.log('Employee found. Proceeding with deletion.');

    // Step 6: Delete employee
    await employeeListPage.deleteEmployee(employeeId);

    // Step 7: Verify employee is deleted
    await employeeListPage.verifyEmployeeDeleted(employeeId);

    console.log(
        'Employee deleted and verified successfully. Employee ID:',
        employeeId
    );
});
