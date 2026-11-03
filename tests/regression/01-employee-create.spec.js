
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeePage } = require('../../pages/EmployeePage');
const { generateEmployeeId } = require('../../utils/testDataGenerator');

const loginData = require('../../test-data/loginData.json');
const employeeData = require('../../test-data/employeeData.json');

// Updated asset path
const imagePath = path.resolve(
    __dirname,
    '../../test-assets/Profile_pic.jpg'
);

// Updated generated employee data path
const generatedDataPath = path.resolve(
    __dirname,
    '../../test-data/generatedEmployee.json'
);

test('Create an employee in OrangeHRM', async ({ page }) => {

    // Step 1: Generate a unique Employee ID
    const employeeId = generateEmployeeId();

    console.log('Generated Employee ID:', employeeId);

    // Step 2: Prepare employee data using JSON and generated ID
    const employee = {
        ...employeeData.employee,
        employeeId: employeeId
    };

    // Step 3: Save generated employee data for reuse
    fs.writeFileSync(
        generatedDataPath,
        JSON.stringify({ employee }, null, 4)
    );

    // Step 4: Initialize Login Page
    const loginPage = new LoginPage(page);

    // Step 5: Open OrangeHRM
    await page.goto('/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
    });

    console.log('URL after opening website:', page.url());
    console.log('Page title:', await page.title());

    // Step 6: Login
    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    console.log('URL after clicking Login:', page.url());

    // Step 7: Verify successful login
    await loginPage.verifyLoginSuccessful();

    // Step 8: Initialize Employee Page
    const employeePage = new EmployeePage(page);

    // Step 9: Navigate to PIM
    await employeePage.navigateToPIM();

    // Step 10: Add employee using generated Employee ID
    await employeePage.addEmployee(
        employee,
        imagePath
    );

    // Step 11: Verify employee creation
    await employeePage.verifyEmployeeCreated();

    console.log(
        'Employee created successfully with ID:',
        employeeId
    );
});
