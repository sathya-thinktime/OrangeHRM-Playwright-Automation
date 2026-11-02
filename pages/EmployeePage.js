
const { expect } = require('@playwright/test');

class EmployeePage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.pimMenu = page.getByText('PIM', {
            exact: true
        });

        // Employee form
        this.addButton = page.getByRole('button', {
            name: 'Add'
        });

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');

        this.employeeIdInput = page.locator(
            'div.oxd-input-group:has(label:text-is("Employee Id")) input'
        );

        this.uploadInput = page.locator('input[type="file"]');

        this.saveButton = page.getByRole('button', {
            name: 'Save'
        });

        // Success notification
        this.successMessage = page.locator('.oxd-toast-content');
    }

    // Navigate to PIM module
    async navigateToPIM() {
        await this.pimMenu.click();

        // Wait until the PIM Add button is visible
        await expect(this.addButton).toBeVisible({
            timeout: 30000
        });

        console.log('Successfully navigated to PIM module');
    }

    // Add a new employee
    async addEmployee(employee, imagePath) {

        // Click Add button
        await this.addButton.click();

        // Verify Add Employee form is loaded
        await expect(this.firstNameInput).toBeVisible({
            timeout: 30000
        });

        console.log('Add Employee form loaded successfully');

        // Enter employee details
        await this.firstNameInput.fill(employee.firstName);

        await this.middleNameInput.fill(employee.middleName);

        await this.lastNameInput.fill(employee.lastName);

        await this.employeeIdInput.fill(employee.employeeId);

        // Upload profile picture
        await this.uploadInput.setInputFiles(imagePath);

        // Save employee details
        await this.saveButton.click();

        console.log('Employee details submitted successfully');
    }

    // Verify employee creation
    async verifyEmployeeCreated() {

        await expect(this.successMessage).toBeVisible({
            timeout: 15000
        });

        const message = await this.successMessage.innerText();

        console.log('OrangeHRM notification:', message);

        await expect(this.successMessage).toContainText(
            'Successfully Saved'
        );
    }
}

module.exports = { EmployeePage };
