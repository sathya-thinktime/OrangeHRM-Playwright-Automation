
const { expect } = require('@playwright/test');

class LoginPage {

    constructor(page) {

        this.page = page;

        // Locators
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
        this.userDropdown = page.locator('.oxd-userdropdown-tab');
        this.logoutButton = page.getByText('Logout', { exact: true });

    }

    // Login method
    async login(username, password) {

        await expect(this.usernameInput).toBeVisible({
            timeout: 30000
        });

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);

        await this.loginButton.click();

        console.log('Login button clicked');
    }

    // Verify successful login
    async verifyLoginSuccessful() {

        // Wait until Dashboard heading is visible
        await expect(
            this.dashboardHeading,
            'Dashboard heading should be visible after successful login'
        ).toBeVisible({
            timeout: 30000
        });

        // Verify dashboard URL
        await expect(
            this.page,
            'Dashboard URL should be displayed after successful login'
        ).toHaveURL(/\/dashboard\/index/, {
            timeout: 15000
        });

        console.log('Login successful');
        console.log('Dashboard URL:', this.page.url());
    }

    // Logout method
    async logout() {

        await expect(this.userDropdown).toBeVisible({
            timeout: 15000
        });

        await this.userDropdown.click();

        await expect(this.logoutButton).toBeVisible({
            timeout: 10000
        });

        await this.logoutButton.click();

        await expect(
            this.page,
            'User should be redirected to login page after logout'
        ).toHaveURL(/\/auth\/login/, {
            timeout: 30000
        });

        console.log('Logout successful');
    }

}

module.exports = { LoginPage };
