# OrangeHRM Employee Lifecycle Automation

## Project Overview

This project automates the employee lifecycle workflow in the OrangeHRM application using **Playwright with JavaScript**.

It follows the Page Object Model (POM) design pattern to improve code reusability, maintainability, and test organization.

The project also includes API testing using Playwright's built-in API testing capabilities.

## Tech Stack

- JavaScript
- Playwright
- Node.js
- npm
- Page Object Model (POM)
- REST API Testing
- JSON Test Data
- dotenv
- Playwright HTML Reporter

## Application Under Test

**OrangeHRM Demo Application:**  
https://opensource-demo.orangehrmlive.com/

**API Testing:**  
https://api.restful-api.dev/

Note: API CRUD testing is performed against a separate REST API and is not directly integrated with OrangeHRM employee records.

## Project Structure

```text
OrangeHRM-Automation/
│
├── pages/
│   ├── LoginPage.js
│   ├── EmployeePage.js
│   ├── EmployeeListPage.js
│   └── EmployeeDetailsPage.js
│
├── tests/
│   ├── 01-employee-create.spec.js
│   ├── 02-employee-search.spec.js
│   ├── 03-employee-update.spec.js
│   ├── 04-employee-delete.spec.js
│   ├── 05-api.spec.js
│   └── 06-logout.spec.js
│
├── test-data/
│   ├── loginData.json
│   ├── employeeData.json
│   └── generatedEmployee.json
│
├── test-assets/
│   └── Profile_pic.jpg
│
├── utils/
│   ├── APIHelper.js
│   └── testDataGenerator.js
│
├── playwright.config.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

## Automated Test Scenarios

### UI Automation – OrangeHRM

1. **Login**
   - Login using valid credentials.
   - Verify successful navigation to the dashboard.

2. **Employee Creation**
   - Navigate to the PIM module.
   - Generate a unique Employee ID dynamically.
   - Create an employee using JSON test data.
   - Upload a profile picture.
   - Verify successful employee creation.

3. **Employee Search**
   - Search for the employee using the generated Employee ID.
   - Verify employee details in the search results.

4. **Employee Update**
   - Open the employee record.
   - Update Job Title and Employment Status.
   - Verify the updated information.

5. **Employee Deletion**
   - Search for the employee.
   - Delete the employee record.
   - Verify successful deletion and confirm that the employee is no longer available.

6. **Logout and Session Validation**
   - Logout from the application.
   - Attempt to access the dashboard directly.
   - Verify redirection to the login page.

### API Automation

API CRUD operations are validated using Playwright's API request functionality.

| HTTP Method | Operation |
|---|---|
| POST | Create an object |
| GET | Retrieve an object |
| PUT | Update an object |
| GET | Verify updated object |
| DELETE | Delete an object |
| GET | Verify deletion |

## Framework Design

### Page Object Model

Page classes contain locators and reusable application actions.

The test files interact with these page classes instead of directly maintaining locators in every test.

### Dynamic Test Data

Employee IDs are generated dynamically to avoid duplicate Employee IDs.

### JSON-Based Test Data

Test data is maintained separately in JSON files for easier maintenance and reuse.

### API Helper

A reusable API helper class handles GET, POST, PUT, and DELETE requests.

## Prerequisites

Install the following:

- Node.js
- npm
- Visual Studio Code
- Git

## Installation and Setup

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd OrangeHRM-Automation
```

Install dependencies:

```bash
npm install
```

Install Playwright Chromium:

```bash
npx playwright install chromium
```

Create a `.env` file in the project root:

```env
API_BASE_URL=https://api.restful-api.dev
```

## Execution Commands

Run all test cases:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Run a specific test file:

```bash
npx playwright test tests/01-employee-create.spec.js
```

## Test Execution Order

The employee lifecycle tests use a generated Employee ID stored in `generatedEmployee.json`.

Therefore, the employee tests should execute in the following order:

1. Employee Creation
2. Employee Search
3. Employee Update
4. Employee Deletion
5. API CRUD
6. Logout

The Playwright configuration uses a single worker to execute tests sequentially.

## Reporting

The project uses the Playwright HTML Reporter.

Generate the HTML report:

```bash
npm run test
```

Open the report:

```bash
npm run test:report
```

The configuration also captures:

- Screenshots on test failure
- Video recordings
- Trace files on failure

## Test Execution Result

The complete test suite was executed successfully.

**Latest execution: 6 tests passed.**

Scenarios covered:

- Employee Creation
- Employee Search
- Employee Update
- Employee Deletion
- API CRUD Operations
- Logout and Session Invalidation

## Author

Sathya

**Project:** OrangeHRM Employee Lifecycle Automation  
**Automation Tool:** Playwright with JavaScript