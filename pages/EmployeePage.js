
const { expect } = require('@playwright/test');

class EmployeePage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.pimMenu = page.getByText('PIM', { exact: true });

        // Employee form
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');

        this.employeeIdInput = page.locator(
            'div.oxd-input-group:has(label:text-is("Employee Id")) input'
        );

        this.uploadInput = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });

        // Success notification
        this.successMessage = page.locator('.oxd-toast-content');

        // Personal Details heading
        this.personalDetailsHeading = page.getByRole(
            'heading',
            { name: 'Personal Details' }
        );
    }

    // Navigate to PIM module
    async navigateToPIM() {
        await this.pimMenu.click();

        await this.page.waitForURL('**/pim/viewEmployeeList', {
            timeout: 30000
        });

        await expect(this.addButton).toBeVisible({
            timeout: 30000
        });

        console.log('Successfully navigated to PIM module');
    }

    // Add a new employee
    async addEmployee(employee, imagePath) {
        await this.addButton.click();

        await expect(this.firstNameInput).toBeVisible({
            timeout: 30000
        });

        console.log('Add Employee form loaded successfully');

        await this.firstNameInput.fill(employee.firstName);
        await this.middleNameInput.fill(employee.middleName);
        await this.lastNameInput.fill(employee.lastName);
        await this.employeeIdInput.fill(employee.employeeId);

        await this.uploadInput.setInputFiles(imagePath);

        await this.saveButton.click();

        console.log('Employee details submitted successfully');
    }

    // Verify employee creation
    async verifyEmployeeCreated() {

        // Wait for Personal Details heading
        await expect(this.personalDetailsHeading).toBeVisible({
            timeout: 60000
        });

        console.log('Employee created successfully');

        console.log('Current URL:', this.page.url());

        // Check success notification if displayed
        if (await this.successMessage.isVisible().catch(() => false)) {
            const message = await this.successMessage.innerText();

            console.log('OrangeHRM notification:', message);
        }
    }
}

module.exports = { EmployeePage };
