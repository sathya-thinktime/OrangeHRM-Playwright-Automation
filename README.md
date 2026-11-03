# OrangeHRM Playwright Automation

An end-to-end test automation framework built using **Playwright with JavaScript** to validate the OrangeHRM application through UI and API testing.

## Project Overview

This project automates key employee management workflows in OrangeHRM, including employee creation, searching, updating, deletion, and logout functionality.

It also integrates OrangeHRM APIs to validate employee information and job details during the employee lifecycle.

### Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Programming language |
| Playwright | UI automation |
| Playwright APIRequestContext | API testing |
| Node.js | Runtime environment |
| npm | Package management |
| dotenv | Environment variable management |
| JSON | Test data management |
| HTML Reporter | Test execution reporting |

## Project Structure

```text
OrangeHRM-Playwright-Automation/
│
├── pages/
│   ├── LoginPage.js
│   ├── EmployeePage.js
│   ├── EmployeeListPage.js
│   └── EmployeeDetailsPage.js
│
├── tests/
│   ├── e2e/
│   │   └── employee-lifecycle.spec.js
│   │
│   └── regression/
│       ├── 01-employee-create.spec.js
│       ├── 02-employee-search.spec.js
│       ├── 03-employee-update.spec.js
│       ├── 04-employee-delete.spec.js
│       ├── 05-api.spec.js
│       └── 06-logout.spec.js
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
├── .env
├── .gitignore
└── README.md
```

## Automated Test Scenarios

### 1. End-to-End Employee Lifecycle

The integrated test validates the complete employee workflow in a single browser session.

- Login to OrangeHRM.
- Authenticate with the OrangeHRM API using OAuth 2.0.
- Create a new employee through the UI.
- Search for the created employee.
- Retrieve employee details through the API.
- Update employee job details through the UI.
- Validate updated job details through the API.
- Delete the employee through the UI.
- Verify employee deletion through the API.
- Logout and verify session invalidation.

### 2. Regression Test Cases

| Test | Scenario |
|---|---|
| 01 | Create a new employee |
| 02 | Search for an existing employee |
| 03 | Update employee details |
| 04 | Delete an employee |
| 05 | Validate OrangeHRM API response |
| 06 | Logout and verify session invalidation |

## Framework Design

### Page Object Model (POM)

The framework follows the Page Object Model design pattern.

- Page-specific locators and actions are maintained in separate page classes.
- Test scripts call reusable page methods.
- This improves maintainability, readability, and reusability.

### Test Data Management

- Login credentials and employee details are maintained in JSON files.
- Employee IDs are generated dynamically.
- Generated employee details are stored for use in dependent regression tests.

### API Integration

OrangeHRM APIs are integrated into the employee lifecycle workflow.

API validations include:

- Employee details retrieval.
- Employee ID and employee number validation.
- First name and last name validation.
- Job title and employment status validation.
- Employee deletion verification.

OAuth 2.0 authorization is used to authenticate API requests.

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Visual Studio Code (recommended)
- Git
- Access to the OrangeHRM demo application

## Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/sathya-thinktime/OrangeHRM-Playwright-Automation.git
```

### Step 2: Navigate to the project directory

```bash
cd OrangeHRM-Playwright-Automation
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Install Playwright browsers

```bash
npx playwright install
```

### Step 5: Configure environment variables

Create a `.env` file in the project root.

Add the required configuration:

```env
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php
ORANGEHRM_CLIENT_ID=your_oauth_client_id
ORANGEHRM_REDIRECT_URI=http://localhost:3000/callback
```

Use your own valid OrangeHRM OAuth client configuration. Do not commit credentials or sensitive values to GitHub.

## Execution Commands

### Run all tests

```bash
npx playwright test
```

### Run all tests in headed mode

```bash
npx playwright test --headed
```

### Run the end-to-end lifecycle test

```bash
npx playwright test tests/e2e/employee-lifecycle.spec.js --headed
```

### Run regression tests

```bash
npx playwright test tests/regression
```

### Run a specific regression test

```bash
npx playwright test tests/regression/01-employee-create.spec.js --headed
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

## Test Reports

The project uses Playwright's HTML reporter.

After execution, generate the report using:

```bash
npx playwright show-report
```

The report provides:

- Test execution status.
- Passed and failed test cases.
- Execution duration.
- Error details.
- Screenshots and traces when applicable.

Screenshots are configured to be captured on test failure. Video recording is enabled in the Playwright configuration.

## Playwright Configuration

The framework configuration includes:

- Chromium browser execution.
- Headed browser execution.
- Sequential test execution.
- Configured test and assertion timeouts.
- HTML reporting.
- Screenshots on failure.
- Video recording.
- Trace retention on failure.

## Current Test Execution Status

**Latest verified result:** All 7 tests passed together and individually.

The suite includes one integrated end-to-end employee lifecycle test and six regression tests.

## Future Enhancements

- Cross-browser execution (Chromium, Firefox, and WebKit).
- CI/CD integration using GitHub Actions.
- Enhanced API negative testing.
- Additional employee management scenarios.
- Improved test data cleanup and isolation.

## Author

**Sathya**

QA Automation Engineer

**GitHub Repository:**  
https://github.com/sathya-thinktime/OrangeHRM-Playwright-Automation
