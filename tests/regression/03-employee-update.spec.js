
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');

const loginData = require('../../test-data/loginData.json');
const employeeData = require('../../test-data/employeeData.json');

const generatedDataPath = path.resolve(
    __dirname,
    '../../test-data/generatedEmployee.json'
);

test('Update employee job details', async ({ page }) => {
    test.setTimeout(120000);

    // Verify generated employee data exists
    if (!fs.existsSync(generatedDataPath)) {
        throw new Error(
            'generatedEmployee.json not found. Run the Employee Create test first.'
        );
    }

    // Read generated employee details
    const generatedData = JSON.parse(
        fs.readFileSync(generatedDataPath, 'utf8')
    );

    const employeeId = generatedData.employee.employeeId;

    // Validate update data
    const jobTitle = employeeData.updatedEmployee.jobTitle;
    const employmentStatus = employeeData.updatedEmployee.employmentStatus;

    if (!jobTitle || !employmentStatus) {
        throw new Error(
            'Job title or employment status is missing in employeeData.json'
        );
    }

    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // Navigate to OrangeHRM
    await page.goto('/');

    // Login
    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    console.log('Login successful');

    // Navigate to Employee List
    await employeeListPage.navigateToEmployeeList();

    // Search for the generated employee
    await employeeListPage.searchEmployee(employeeId);

    console.log('Employee found. Employee ID:', employeeId);

    // Open employee record
    const empNumber = await employeeListPage.openEmployee(employeeId);

    console.log(
        'Employee record opened. Internal Employee Number:',
        empNumber
    );

    // Update Job Details
    await employeeListPage.updateJobDetails(
        jobTitle,
        employmentStatus
    );

    console.log('Employee job details updated successfully.');
    console.log('Employee ID:', employeeId);
    console.log('Updated Job Title:', jobTitle);
    console.log('Updated Employment Status:', employmentStatus);
});
