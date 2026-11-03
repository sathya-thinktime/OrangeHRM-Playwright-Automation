
const { test } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');

const loginData = require('../../test-data/loginData.json');

test('Delete employee and verify deletion', async ({ page }) => {

    // // Step 1: Load generated employee data
    // const generatedData = require('../../test-data/generatedEmployee.json');

    const employeeId = generatedData.employee.employeeId;

    // Step 2: Initialize Page Objects
    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    console.log('Employee ID to be deleted:', employeeId);

    // Step 3: Login
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    // Step 4: Navigate to Employee List
    await employeeListPage.navigateToEmployeeList();

    // Step 5: Search employee using generated Employee ID
    await employeeListPage.searchEmployee(employeeId);

    // Step 6: Verify employee exists before deletion
    await employeeListPage.verifyEmployeeDisplayed(
        generatedData.employee.firstName,
        generatedData.employee.lastName
    );

    console.log('Employee found. Proceeding with deletion.');

    // Step 7: Delete employee
    await employeeListPage.deleteEmployee(employeeId);

    // Step 8: Verify employee is deleted
    await employeeListPage.verifyEmployeeDeleted(employeeId);

    console.log(
        'Employee deleted and verified successfully. Employee ID:',
        employeeId
    );
});
