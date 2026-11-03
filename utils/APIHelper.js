
const crypto = require('crypto');
const http = require('http');

class APIHelper {
    constructor(request) {
        this.request = request;

        const configuredBaseURL = process.env.ORANGEHRM_BASE_URL;
        this.clientId = process.env.ORANGEHRM_CLIENT_ID;
        this.redirectURI = process.env.ORANGEHRM_REDIRECT_URI;

        if (!configuredBaseURL || !this.clientId || !this.redirectURI) {
            throw new Error(
                'OrangeHRM OAuth environment variables are missing'
            );
        }

        this.baseURL = new URL(configuredBaseURL).origin;
        this.accessToken = null;
    }

    generatePKCE() {
        const codeVerifier = crypto
            .randomBytes(32)
            .toString('base64url');

        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        return { codeVerifier, codeChallenge };
    }

    async authorizeAndGetToken(page) {
        const { codeVerifier, codeChallenge } = this.generatePKCE();
        const state = crypto.randomBytes(16).toString('hex');

        let callbackServer;

        try {
            const authorizationCode = new Promise((resolve, reject) => {
                callbackServer = http.createServer((req, res) => {
                    const callbackURL = new URL(req.url, this.redirectURI);

                    if (callbackURL.pathname !== '/callback') {
                        res.writeHead(404);
                        res.end('Not Found');
                        return;
                    }

                    const returnedState =
                        callbackURL.searchParams.get('state');

                    const code = callbackURL.searchParams.get('code');
                    const error = callbackURL.searchParams.get('error');

                    if (returnedState !== state) {
                        res.writeHead(400);
                        res.end('Invalid OAuth state');
                        reject(new Error('OAuth state validation failed'));
                        return;
                    }

                    if (error) {
                        res.writeHead(400);
                        res.end('OAuth authorization failed');
                        reject(new Error(`OAuth error: ${error}`));
                        return;
                    }

                    if (!code) {
                        res.writeHead(400);
                        res.end('Authorization code not received');
                        reject(new Error('Authorization code missing'));
                        return;
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.end(
                        '<h2>OrangeHRM authorization successful. You can close this tab.</h2>'
                    );

                    resolve(code);
                });

                callbackServer.on('error', reject);
            });

            await new Promise((resolve, reject) => {
                callbackServer.once('error', reject);
                callbackServer.listen(3000, '127.0.0.1', resolve);
            });

            const authorizationURL = new URL(
                `${this.baseURL}/oauth2/authorize`
            );

            authorizationURL.searchParams.set('response_type', 'code');
            authorizationURL.searchParams.set('client_id', this.clientId);
            authorizationURL.searchParams.set('redirect_uri', this.redirectURI);
            authorizationURL.searchParams.set('code_challenge', codeChallenge);
            authorizationURL.searchParams.set('code_challenge_method', 'S256');
            authorizationURL.searchParams.set('state', state);

            console.log('Opening OrangeHRM OAuth authorization page');

            await page.goto(authorizationURL.toString());

            // Capture the actual page details for CI diagnosis
            await page.waitForLoadState('domcontentloaded');

            console.log('OAuth page URL:', page.url());
            console.log('OAuth page title:', await page.title());

            const pageText = await page.locator('body').innerText();

            console.log(
                'OAuth page content:',
                pageText.substring(0, 3000)
            );

            // Find and click consent button once
            const consentButton = page.getByRole('button', {
                name: 'Allow Access'
            });

            await consentButton.waitFor({
                state: 'visible',
                timeout: 15000
            });

            await consentButton.click();

            console.log('OAuth consent granted');

            // Receive authorization code through callback
            const code = await authorizationCode;

            console.log('Authorization code received');

            // Exchange authorization code for access token
            const tokenResponse = await this.request.post(
                `${this.baseURL}/oauth2/token`,
                {
                    form: {
                        grant_type: 'authorization_code',
                        code,
                        client_id: this.clientId,
                        redirect_uri: this.redirectURI,
                        code_verifier: codeVerifier
                    }
                }
            );

            if (!tokenResponse.ok()) {
                throw new Error(
                    `Token request failed: ${tokenResponse.status()} - ${await tokenResponse.text()}`
                );
            }

            const tokenData = await tokenResponse.json();

            this.accessToken = tokenData.access_token;

            if (!this.accessToken) {
                throw new Error(
                    'OrangeHRM access token was not returned'
                );
            }

            console.log('OrangeHRM API authentication successful');

            return this.accessToken;

        } finally {
            if (callbackServer) {
                await new Promise(resolve => {
                    callbackServer.close(resolve);
                });
            }
        }
    }

    getHeaders() {
        if (!this.accessToken) {
            throw new Error(
                'API access token is not available. Authenticate first.'
            );
        }

        return {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: 'application/json'
        };
    }

    async getEmployee(empNumber) {
        return await this.request.get(
            `${this.baseURL}/api/v2/pim/employees/${empNumber}`,
            { headers: this.getHeaders() }
        );
    }

    async getEmployeeJobDetails(empNumber) {
        return await this.request.get(
            `${this.baseURL}/api/v2/pim/employees/${empNumber}/job-details`,
            { headers: this.getHeaders() }
        );
    }

    async getEmployees() {
        return await this.request.get(
            `${this.baseURL}/api/v2/pim/employees`,
            { headers: this.getHeaders() }
        );
    }
}

module.exports = { APIHelper };
