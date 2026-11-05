
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');

const loginData = require('../../test-data/loginData.json');

const generatedDataPath = path.resolve(
    __dirname,
    '../../test-data/generatedEmployee.json'
);

test('Delete employee and verify deletion', async ({ page }) => {

    test.setTimeout(120000);

    // Load generated employee data at test execution time
    if (!fs.existsSync(generatedDataPath)) {
        throw new Error(
            'generatedEmployee.json not found. Run the Employee Create test first.'
        );
    }

    const generatedData = JSON.parse(
        fs.readFileSync(generatedDataPath, 'utf8')
    );

    const employeeId = generatedData.employee.employeeId;

    const loginPage = new LoginPage(page);
    const employeeListPage = new EmployeeListPage(page);

    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    console.log('Login successful');

    await employeeListPage.navigateToEmployeeList();

    await employeeListPage.searchEmployee(employeeId);

    console.log('Employee found. Proceeding with deletion.');

    await employeeListPage.deleteEmployee(employeeId);

    console.log(
        'Employee deleted and verified successfully. Employee ID:',
        employeeId
    );
});
