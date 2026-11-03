
const { test } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');
const { EmployeeDetailsPage } = require('../../pages/EmployeeDetailsPage');

const loginData = require('../../test-data/loginData.json');
const generatedData = require('../../test-data/generatedEmployee.json');
const employeeData = require('../../test-data/employeeData.json');

test('Update employee job details', async ({ page }) => {

    // Step 1: Initialize Page Objects
    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);
    const employeeDetailsPage = new EmployeeDetailsPage(page);

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

    // Step 5: Open employee record
    await employeeListPage.openEmployee(
        generatedData.employee.employeeId
    );

    // Step 6: Open Job tab
    await employeeDetailsPage.openJobTab();

    // Step 7: Update Job Title
    await employeeDetailsPage.updateJobTitle(
        employeeData.updatedEmployee.jobTitle
    );

    // Step 8: Update Employment Status
    await employeeDetailsPage.updateEmploymentStatus(
        employeeData.updatedEmployee.employmentStatus
    );

    // Step 9: Save and verify changes
    await employeeDetailsPage.saveChanges();

    await employeeDetailsPage.verifyUpdatedDetails(
        employeeData.updatedEmployee.jobTitle,
        employeeData.updatedEmployee.employmentStatus
    );

    console.log(
        'Employee job details updated successfully. Employee ID:',
        generatedData.employee.employeeId
    );
});
