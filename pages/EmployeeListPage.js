
const { expect } = require('@playwright/test');

class EmployeeListPage {
    constructor(page) {
        this.page = page;

        // PIM navigation
        this.pimMenu = page.getByRole('link', { name: 'PIM' });

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
        await this.pimMenu.click();

        await this.employeeListMenu.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await this.employeeListMenu.click();
    }

    // Search employee using Employee ID
    async searchEmployee(employeeId) {
        await this.employeeIdInput.fill(employeeId);
        await this.searchButton.click();

        await expect(this.resultRows.first()).toBeVisible({
            timeout: 15000
        });
    }

    // Verify employee is displayed in search results
    async verifyEmployeeDisplayed(firstName, lastName) {
        const employeeRow = this.resultRows
            .filter({ hasText: firstName })
            .filter({ hasText: lastName });

        await expect(employeeRow).toHaveCount(1);
    }

    // Open employee record and capture internal employee number
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

        // Wait for employee details page
        await this.page.waitForURL(
            /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
            { timeout: 15000 }
        );

        // Extract OrangeHRM internal employee number
        const match = this.page.url().match(/empNumber\/(\d+)/);

        if (!match) {
            throw new Error('Unable to capture OrangeHRM empNumber');
        }

        const empNumber = match[1];

        console.log('OrangeHRM Internal Employee Number:', empNumber);

        return empNumber;
    }

    // Delete employee using Employee ID
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

        // Confirm deletion
        await expect(this.confirmDeleteButton).toBeVisible();

        await this.confirmDeleteButton.click();

        // Verify deletion notification
        await expect(
            this.page.getByText('Successfully Deleted', {
                exact: false
            })
        ).toBeVisible({
            timeout: 15000
        });
    }

    // Verify employee is no longer displayed
    async verifyEmployeeDeleted(employeeId) {
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
