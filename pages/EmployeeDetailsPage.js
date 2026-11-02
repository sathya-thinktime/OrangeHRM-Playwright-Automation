
const { expect } = require('@playwright/test');

class EmployeeDetailsPage {
    constructor(page) {
        this.page = page;

        // Employee details tabs
        this.jobTab = page.getByRole('tab', { name: 'Job' });

        // Job details fields
        this.jobTitleDropdown = page.locator(
            'div.oxd-input-group:has(label:text-is("Job Title")) .oxd-select-text'
        );

        this.employmentStatusDropdown = page.locator(
            'div.oxd-input-group:has(label:text-is("Employment Status")) .oxd-select-text'
        );

        this.saveButton = page.getByRole('button', { name: 'Save' });

        // Success notification
        this.successMessage = page.getByText(
            'Successfully Updated',
            { exact: false }
        );
    }

    // Open Job tab
    async openJobTab() {
        await this.jobTab.click();
    }

    // Update Job Title
    async updateJobTitle(jobTitle) {
        await this.jobTitleDropdown.click();

        await this.page.getByRole('option', {
            name: jobTitle,
            exact: true
        }).click();
    }

    // Update Employment Status
    async updateEmploymentStatus(status) {
        await this.employmentStatusDropdown.click();

        await this.page.getByRole('option', {
            name: status,
            exact: true
        }).click();
    }

    // Save changes
    async saveChanges() {
        await this.saveButton.click();

        await expect(this.successMessage).toBeVisible({
            timeout: 15000
        });
    }

    // Verify updated Job Title
    async verifyJobTitle(jobTitle) {
        await expect(this.jobTitleDropdown).toContainText(jobTitle);
    }

    // Verify updated Employment Status
    async verifyEmploymentStatus(status) {
        await expect(this.employmentStatusDropdown).toContainText(status);
    }

    // Verify all updated employee details
    async verifyUpdatedDetails(jobTitle, status) {
        await this.verifyJobTitle(jobTitle);
        await this.verifyEmploymentStatus(status);

        console.log('Updated Job Title:', jobTitle);
        console.log('Updated Employment Status:', status);
    }
}

module.exports = { EmployeeDetailsPage };
