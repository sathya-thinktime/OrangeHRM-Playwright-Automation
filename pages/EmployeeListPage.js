
const { expect } = require('@playwright/test');

class EmployeeListPage {
    constructor(page) {
        this.page = page;

        // PIM navigation
        this.pimMenu = page.getByRole('link', {
            name: 'PIM'
        });

        this.employeeListMenu = page.locator('a').filter({
            hasText: 'Employee List'
        });

        // Employee search
        this.employeeIdInput = page.locator(
            'div.oxd-input-group:has(label:text-is("Employee Id")) input'
        );

        this.searchButton = page.getByRole('button', {
            name: 'Search'
        });

        this.resultRows = page.locator(
            '.oxd-table-body .oxd-table-row'
        );

        // Delete confirmation popup
        this.confirmDeleteButton = page.getByRole('button', {
            name: 'Yes, Delete'
        });
    }

    // Navigate to Employee List
    async navigateToEmployeeList() {
        await this.pimMenu.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.pimMenu.click();

        await this.employeeListMenu.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.employeeListMenu.click();

        await this.employeeIdInput.waitFor({
            state: 'visible',
            timeout: 15000
        });
    }

    // Ensure Employee List page is open before searching
    async ensureEmployeeListPage() {
        const currentURL = this.page.url();

        // If already on Employee List, do not navigate again
        if (
            currentURL.includes('/pim/viewEmployeeList') &&
            await this.employeeIdInput.isVisible().catch(() => false)
        ) {
            return;
        }

        // Otherwise, navigate from the current page
        await this.navigateToEmployeeList();
    }

    // Search employee using Employee ID
    async searchEmployee(employeeId) {

        // Ensure Employee List is open
        await this.ensureEmployeeListPage();

        // Wait for Employee ID input
        await this.employeeIdInput.waitFor({
            state: 'visible',
            timeout: 15000
        });

        // Enter Employee ID
        await this.employeeIdInput.fill(employeeId);

        // Click Search
        await this.searchButton.click();

        // Wait for search results
        await expect(this.resultRows.first()).toBeVisible({
            timeout: 15000
        });

        console.log('Employee search successful');
    }

    // Verify employee is displayed
    async verifyEmployeeDisplayed(firstName, lastName) {
        const employeeRow = this.resultRows
            .filter({ hasText: firstName })
            .filter({ hasText: lastName });

        await expect(employeeRow).toHaveCount(1);
    }

    // Open employee record
    async openEmployee(employeeId) {
        const employeeRow = this.resultRows.filter({
            hasText: employeeId
        });

        await expect(employeeRow).toHaveCount(1);

        const editButton = employeeRow
            .locator('.oxd-icon-button')
            .first();

        await expect(editButton).toBeVisible();

        await editButton.click();

        await this.page.waitForURL(
            /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
            {
                timeout: 15000
            }
        );

        const match = this.page.url().match(
            /empNumber\/(\d+)/
        );

        if (!match) {
            throw new Error(
                'Unable to capture OrangeHRM empNumber'
            );
        }

        const empNumber = match[1];

        console.log(
            'OrangeHRM Internal Employee Number:',
            empNumber
        );

        return empNumber;
    }

    // Select a value from an OrangeHRM dropdown
    async selectDropdownValue(label, value) {

        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(
                `Invalid dropdown value for "${label}": ${value}`
            );
        }

        const dropdown = this.page.locator(
            `div.oxd-input-group:has(label:text-is("${label}")) .oxd-select-text`
        );

        await expect(dropdown).toBeVisible({
            timeout: 10000
        });

        await dropdown.click();

        const escapedValue = value.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

        const option = this.page.locator(
            '.oxd-select-option'
        ).filter({
            hasText: new RegExp(`^${escapedValue}$`)
        });

        await expect(option).toBeVisible({
            timeout: 10000
        });

        await option.click();
    }

    // Update employee job details
    async updateJobDetails(jobTitle, employmentStatus) {

        // Navigate to Job tab
        const jobTab = this.page.getByRole('link', {
            name: 'Job',
            exact: true
        });

        await expect(jobTab).toBeVisible({
            timeout: 15000
        });

        await jobTab.click();

        // Wait for Job Details section
        await expect(
            this.page.getByText('Job Details', {
                exact: true
            })
        ).toBeVisible({
            timeout: 15000
        });

        console.log('Navigated to Job Details tab');

        // Verify that the form is ready for editing
        const saveButton = this.page.getByRole('button', {
            name: 'Save',
            exact: true
        });

        await expect(saveButton).toBeVisible({
            timeout: 15000
        });

        console.log(
            'Job Details form is ready for editing'
        );

        // Update Job Title
        await this.selectDropdownValue(
            'Job Title',
            jobTitle
        );

        console.log(
            'Job Title selected:',
            jobTitle
        );

        // Update Employment Status
        await this.selectDropdownValue(
            'Employment Status',
            employmentStatus
        );

        console.log(
            'Employment Status selected:',
            employmentStatus
        );

        // Save changes
        await saveButton.click();

        // Verify update notification
        await expect(
            this.page.getByText('Successfully Updated', {
                exact: false
            })
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            'Employee job details updated successfully'
        );
    }

    // Delete employee
    async deleteEmployee(employeeId) {
        const employeeRow = this.resultRows.filter({
            hasText: employeeId
        });

        await expect(employeeRow).toHaveCount(1);

        const deleteButton = employeeRow
            .locator('.oxd-icon-button')
            .nth(1);

        await expect(deleteButton).toBeVisible();

        await deleteButton.click();

        await expect(
            this.confirmDeleteButton
        ).toBeVisible();

        await this.confirmDeleteButton.click();

        await expect(
            this.page.getByText('Successfully Deleted', {
                exact: false
            })
        ).toBeVisible({
            timeout: 15000
        });
    }

    // Verify employee deletion
    async verifyEmployeeDeleted(employeeId) {

        // Ensure Employee List is open
        await this.ensureEmployeeListPage();

        await this.employeeIdInput.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.employeeIdInput.fill(employeeId);

        await this.searchButton.click();

        await expect(
            this.resultRows.filter({
                hasText: employeeId
            })
        ).toHaveCount(0);
    }
}

module.exports = { EmployeeListPage };
