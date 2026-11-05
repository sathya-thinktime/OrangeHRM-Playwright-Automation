# OrangeHRM Employee Lifecycle Automation

A UI and API test automation framework for the OrangeHRM application, developed using **Playwright with JavaScript**. The framework follows the **Page Object Model (POM)** design pattern and includes end-to-end testing, regression testing, API validation, dynamic test data generation, and CI/CD integration using GitHub Actions.

## Project Overview

This project automates the employee lifecycle workflow in OrangeHRM, covering employee creation, search, update, deletion, and logout.

It also validates employee information through OrangeHRM APIs using OAuth 2.0 authentication.

## Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript | Automation scripting |
| Playwright Test | UI and API automation |
| Node.js | JavaScript runtime |
| npm | Package management |
| Page Object Model | Framework design |
| REST API | Backend validation |
| OAuth 2.0 | API authentication |
| JSON | Test data management |
| dotenv | Environment configuration |
| Git & GitHub | Version control |
| GitHub Actions | CI/CD pipeline |
| Playwright HTML Reporter | Test reporting |

## Application Under Test

- **Application:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)
- **API:** OrangeHRM API v2
- **Browser:** Chromium

## Project Structure

```text
OrangeHRM-Playwright-Automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
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
├── package-lock.json
├── .gitignore
└── README.md
```

## Automated Test Scenarios

### 1. UI Automation – Employee Lifecycle

| Scenario | Description |
|---|---|
| Login | Authenticate using valid credentials and verify dashboard access |
| Employee Creation | Create an employee using dynamically generated test data |
| Profile Picture Upload | Upload a profile picture during employee creation |
| Employee Search | Search and verify an employee using Employee ID |
| Employee Update | Update Job Title and Employment Status |
| Employee Deletion | Delete an employee and verify successful deletion |
| Logout | Log out and validate session termination |

### 2. End-to-End Automation

The E2E test validates the employee lifecycle workflow, combining UI operations and API validations.

**Workflow:**

```text
Login
  ↓
Create Employee
  ↓
Capture Employee Details
  ↓
Validate Employee through API
  ↓
Update Job Details
  ↓
Validate Updated Details through API
  ↓
Search Employee
  ↓
Delete Employee
  ↓
Verify Deletion
  ↓
Logout
```

### 3. API Automation

API testing is implemented using Playwright's API request capabilities.

Key validations include:

- OAuth 2.0 authentication using PKCE.
- Employee list retrieval.
- Employee details validation using internal Employee Number.
- Job Details API validation.
- Verification of updated Job Title and Employment Status.
- Retry handling for temporary network failures.

## Framework Features

**Page Object Model (POM)**

- Separates page locators and application actions from test scripts.
- Improves reusability and maintainability.

**Dynamic Test Data**

- Generates unique employee details to reduce duplicate-data conflicts.
- Stores generated employee information for dependent test scenarios.

**JSON-Based Test Data**

- Maintains login and employee test data separately.
- Supports easier test data maintenance.

**Reusable API Helper**

- Centralizes API authentication, request handling and response validation.
- Includes retry handling for temporary network failures.

**Playwright Configuration**

- Sequential execution using a single worker.
- Configurable test and assertion timeouts.
- HTML and list reporters.
- Screenshots on failure.
- Video recording and trace collection for debugging.

## Prerequisites

Install the following:

- Node.js
- npm
- Git
- Visual Studio Code

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/sathya-thinktime/OrangeHRM-Playwright-Automation.git
```

**2. Navigate to the project directory**

```bash
cd OrangeHRM-Playwright-Automation
```

**3. Install dependencies**

```bash
npm install
```

**4. Install Playwright Chromium**

```bash
npx playwright install chromium
```

**5. Configure environment variables**

Create a `.env` file in the project root.

Configure the required variables:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php
ORANGEHRM_CLIENT_ID=your_oauth_client_id
ORANGEHRM_REDIRECT_URI=http://localhost:3000/callback
```

Use your own valid OAuth client ID. Do not commit `.env` or expose credentials in the repository.

For GitHub Actions, configure `ORANGEHRM_CLIENT_ID` under repository Actions secrets.

## Test Execution Commands

**Run all tests**

```bash
npm test
```

**Run tests in headed mode**

```bash
npm run test:headed
```

**Run a specific test file**

```bash
npx playwright test tests/regression/01-employee-create.spec.js
```

**Run E2E tests**

```bash
npx playwright test tests/e2e
```

**Run regression tests**

```bash
npx playwright test tests/regression
```

**Run tests in debug mode**

```bash
npx playwright test --debug
```

**Generate and view HTML report**

```bash
npm run test:report
```

## CI/CD – GitHub Actions

The project is integrated with GitHub Actions to execute Playwright tests in a CI environment.

**Pipeline execution:**

```text
GitHub Push
    ↓
Checkout Repository
    ↓
Setup Node.js
    ↓
Install Dependencies
    ↓
Install Playwright Chromium
    ↓
Configure Environment Variables
    ↓
Execute Playwright Tests
    ↓
Upload HTML Report
    ↓
Upload Test Results
```

### CI Execution Results

- GitHub Actions workflow executed successfully.
- Playwright test execution completed successfully.
- HTML report uploaded as a workflow artifact.
- Test results uploaded as a workflow artifact.

[View GitHub Actions](https://github.com/sathya-thinktime/OrangeHRM-Playwright-Automation/actions)

## Reporting and Debugging

The framework uses Playwright HTML Reporter to generate execution reports.

Reports can be viewed locally using:

```bash
npm run test:report
```

The framework also captures:

- Screenshots on test failure.
- Video recordings.
- Execution traces on failure.

GitHub Actions uploads the HTML report and test results as downloadable artifacts.

## Important Notes

- The OrangeHRM demo application is a shared public environment.
- Employee records created during execution may remain in the application until deleted or the demo environment is reset.
- The employee lifecycle scenarios depend on dynamically generated employee data.
- Tests are configured for sequential execution because some scenarios share generated test data.
- OAuth configuration and credentials must be maintained securely through environment variables and GitHub Actions secrets.

## Author

**Sathya**  
QA Automation Engineer

**Project:** OrangeHRM Employee Lifecycle Automation  
**Automation Framework:** Playwright with JavaScript

[GitHub Repository](https://github.com/sathya-thinktime/OrangeHRM-Playwright-Automation)
