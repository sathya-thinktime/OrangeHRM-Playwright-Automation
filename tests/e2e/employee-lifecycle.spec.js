
const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../../pages/LoginPage');
const { EmployeePage } = require('../../pages/EmployeePage');
const { EmployeeListPage } = require('../../pages/EmployeeListPage');
const { EmployeeDetailsPage } = require('../../pages/EmployeeDetailsPage');

const { APIHelper } = require('../../utils/APIHelper');

const loginData = require('../../test-data/loginData.json');
const employeeData = require('../../test-data/employeeData.json');

const { generateEmployeeId } = require('../../utils/testDataGenerator');

const path = require('path');

test('Complete OrangeHRM Employee Lifecycle with API Validation', async ({ page, request }) => {

    // Allow sufficient time for the complete lifecycle
    test.setTimeout(180000);

    // 1. Initialize Page Objects and API Helper
    const loginPage = new LoginPage(page);
    const employeePage = new EmployeePage(page);
    const employeeListPage = new EmployeeListPage(page);
    const employeeDetailsPage = new EmployeeDetailsPage(page);

    const apiHelper = new APIHelper(request);

    // 2. Generate employee data
    const employeeId = generateEmployeeId();

    const employee = {
        ...employeeData.employee,
        employeeId: employeeId
    };

    // Updated path because the test is now inside tests/e2e
    const imagePath = path.join(
        __dirname,
        '../../test-assets/Profile_pic.jpg'
    );

    console.log('Generated Employee ID:', employeeId);
    console.log('Employee data:', employee);

    // 3. UI Login
    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

    console.log('UI login successful');

    // 4. OrangeHRM API Authentication
    await apiHelper.authorizeAndGetToken(page);

    console.log('API authentication successful');

    // Return to OrangeHRM dashboard after OAuth authorization
    await page.goto('/web/index.php/dashboard/index');

    await page.waitForLoadState('domcontentloaded');

    await expect(
        page.getByRole('heading', {
            name: 'Dashboard',
            exact: true
        })
    ).toBeVisible({ timeout: 30000 });

    console.log('Returned to OrangeHRM dashboard');

    // 5. Create Employee through UI
    await employeePage.navigateToPIM();

    await employeePage.addEmployee(employee, imagePath);

    await employeePage.verifyEmployeeCreated();

    console.log('Employee created successfully through UI');

    // 6. Search Employee
    await employeeListPage.navigateToEmployeeList();

    await employeeListPage.searchEmployee(employeeId);

    await employeeListPage.verifyEmployeeDisplayed(
        employee.firstName,
        employee.lastName
    );

    console.log('Employee search successful');

    // 7. Open Employee and capture internal employee number
    const empNumber = await employeeListPage.openEmployee(employeeId);

    console.log('Captured empNumber:', empNumber);

    // 8. API Validation - Employee Creation
    const createdEmployeeResponse = await apiHelper.getEmployee(empNumber);

    expect(createdEmployeeResponse.status()).toBe(200);

    const createdEmployeeData = await createdEmployeeResponse.json();

    expect(createdEmployeeData.data.empNumber).toBe(Number(empNumber));
    expect(createdEmployeeData.data.employeeId).toBe(employeeId);
    expect(createdEmployeeData.data.firstName).toBe(employee.firstName);
    expect(createdEmployeeData.data.lastName).toBe(employee.lastName);

    console.log('API validation passed: Employee creation');

    // 9. Update Employee through UI
    await employeeDetailsPage.openJobTab();

    await employeeDetailsPage.updateJobTitle(
        employeeData.updatedEmployee.jobTitle
    );

    await employeeDetailsPage.updateEmploymentStatus(
        employeeData.updatedEmployee.employmentStatus
    );

    await employeeDetailsPage.saveChanges();

    await employeeDetailsPage.verifyUpdatedDetails(
        employeeData.updatedEmployee.jobTitle,
        employeeData.updatedEmployee.employmentStatus
    );

    console.log('Employee updated successfully through UI');

    // 10. API Validation - Updated Employee
    const updatedEmployeeResponse = await apiHelper.getEmployee(empNumber);

    expect(updatedEmployeeResponse.status()).toBe(200);

    const updatedEmployeeData = await updatedEmployeeResponse.json();

    expect(updatedEmployeeData.data.empNumber).toBe(Number(empNumber));

    console.log('API validation passed: Updated employee exists');

    // 11. API Validation - Updated Job Details
    const jobDetailsResponse = await apiHelper.getEmployeeJobDetails(empNumber);

    expect(jobDetailsResponse.status()).toBe(200);

    const jobDetailsData = await jobDetailsResponse.json();

    expect(jobDetailsData.data.jobTitle.title).toBe(
        employeeData.updatedEmployee.jobTitle
    );

    expect(jobDetailsData.data.empStatus.name).toBe(
        employeeData.updatedEmployee.employmentStatus
    );

    console.log('API validation passed: Updated Job Title');
    console.log('API validation passed: Updated Employment Status');

    // 12. Delete Employee through UI
    await employeeListPage.navigateToEmployeeList();

    await employeeListPage.searchEmployee(employeeId);

    await employeeListPage.deleteEmployee(employeeId);

    await employeeListPage.verifyEmployeeDeleted(employeeId);

    console.log('Employee deleted successfully through UI');

    // 13. API Validation - Employee Deletion
    const deletedEmployeeResponse = await apiHelper.getEmployee(empNumber);

    expect(deletedEmployeeResponse.status()).toBe(422);

    const deletionResponseData = await deletedEmployeeResponse.json();

    expect(deletionResponseData.error.message).toBe('Invalid Parameter');

    expect(
        deletionResponseData.error.data.invalidParamKeys
    ).toContain('empNumber');

    console.log('API validation passed: Deleted employee is no longer retrievable');

    // 14. Logout
    await loginPage.logout();

    await expect(page).toHaveURL(/\/auth\/login/);

    console.log('Logout successful');
});
