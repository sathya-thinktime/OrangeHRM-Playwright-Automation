
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

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

    }

    // Verify successful login
    async verifyLoginSuccessful() {

        await expect(
            this.page,
            'Dashboard URL should be displayed after successful login'
        ).toHaveURL(/\/dashboard\/index/);

        await expect(
            this.dashboardHeading,
            'Dashboard heading should be visible'
        ).toBeVisible();

    }

    // Logout method
    async logout() {

        await this.userDropdown.click();
        await this.logoutButton.click();

        await expect(
            this.page,
            'User should be redirected to login page after logout'
        ).toHaveURL(/\/auth\/login/);

    }

}

module.exports = { LoginPage };
