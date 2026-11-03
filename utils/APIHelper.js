
const crypto = require('crypto');
const http = require('http');

class APIHelper {
    constructor(request) {
        this.request = request;

        this.baseURL = process.env.ORANGEHRM_BASE_URL;
        this.clientId = process.env.ORANGEHRM_CLIENT_ID;
        this.redirectURI = process.env.ORANGEHRM_REDIRECT_URI;

        if (!this.baseURL || !this.clientId || !this.redirectURI) {
            throw new Error(
                'OrangeHRM OAuth environment variables are missing'
            );
        }

        // Normalize base URL
        this.baseURL = this.baseURL.replace(/\/+$/, '');

        // Validate the application base path
        const parsedBaseURL = new URL(this.baseURL);

        if (parsedBaseURL.pathname.replace(/\/+$/, '') !== '/web/index.php') {
            throw new Error(
                `Invalid ORANGEHRM_BASE_URL: ${this.baseURL}. ` +
                'Expected URL ending with /web/index.php'
            );
        }

        this.accessToken = null;

        console.log('OrangeHRM configured base URL:', this.baseURL);
    }

    // Generate PKCE code verifier and challenge
    generatePKCE() {
        const codeVerifier = crypto
            .randomBytes(32)
            .toString('base64url');

        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        return {
            codeVerifier,
            codeChallenge
        };
    }

    // Build URLs without losing /web/index.php
    buildURL(endpoint) {
        return `${this.baseURL}/${endpoint.replace(/^\/+/, '')}`;
    }

    // Authenticate with OrangeHRM and obtain access token
    async authorizeAndGetToken(page) {
        const { codeVerifier, codeChallenge } = this.generatePKCE();

        const state = crypto.randomBytes(16).toString('hex');

        let callbackServer;

        try {
            // Start local OAuth callback server
            const authorizationCode = new Promise((resolve, reject) => {
                callbackServer = http.createServer((req, res) => {
                    const callbackURL = new URL(
                        req.url,
                        this.redirectURI
                    );

                    if (callbackURL.pathname !== '/callback') {
                        res.writeHead(404);
                        res.end('Not Found');
                        return;
                    }

                    const returnedState =
                        callbackURL.searchParams.get('state');

                    const code = callbackURL.searchParams.get('code');

                    const error = callbackURL.searchParams.get('error');

                    // Validate OAuth state
                    if (returnedState !== state) {
                        res.writeHead(400);
                        res.end('Invalid OAuth state');

                        reject(
                            new Error('OAuth state validation failed')
                        );
                        return;
                    }

                    // Handle OAuth error
                    if (error) {
                        res.writeHead(400);
                        res.end('OAuth authorization failed');

                        reject(
                            new Error(`OAuth error: ${error}`)
                        );
                        return;
                    }

                    // Validate authorization code
                    if (!code) {
                        res.writeHead(400);
                        res.end('Authorization code not received');

                        reject(
                            new Error('Authorization code missing')
                        );
                        return;
                    }

                    // Send success response
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

            // Wait until callback server is listening
            await new Promise((resolve, reject) => {
                callbackServer.once('error', reject);

                callbackServer.listen(3000, '127.0.0.1', resolve);
            });

            // Construct authorization URL
            const authorizationURL = new URL(
                this.buildURL('oauth2/authorize')
            );

            authorizationURL.searchParams.set('response_type', 'code');
            authorizationURL.searchParams.set('client_id', this.clientId);
            authorizationURL.searchParams.set('redirect_uri', this.redirectURI);
            authorizationURL.searchParams.set('code_challenge', codeChallenge);
            authorizationURL.searchParams.set('code_challenge_method', 'S256');
            authorizationURL.searchParams.set('state', state);

            console.log('Opening OrangeHRM OAuth authorization page');

            console.log(
                'Authorization URL:',
                authorizationURL.toString().replace(
                    this.clientId,
                    'REDACTED'
                )
            );

            // Open authorization page
            await page.goto(authorizationURL.toString());

            await page.waitForLoadState('domcontentloaded');

            // Diagnose OAuth page
            console.log('OAuth page URL:', page.url());
            console.log('OAuth page title:', await page.title());

            const pageText = await page.locator('body').innerText();

            console.log(
                'OAuth page content:',
                pageText.substring(0, 3000)
            );

            // Stop if OrangeHRM returns 404
            if (
                pageText.includes('The requested URL was not found') ||
                (await page.title()).includes('404')
            ) {
                throw new Error(
                    `OrangeHRM OAuth authorization URL returned 404: ${page.url()}`
                );
            }

            // Find OAuth consent button
            const consentButton = page.getByRole('button', {
                name: 'Allow Access'
            });

            await consentButton.waitFor({
                state: 'visible',
                timeout: 15000
            });

            // Grant OAuth access
            await consentButton.click();

            console.log('OAuth consent granted');

            // Receive authorization code
            const code = await authorizationCode;

            console.log('Authorization code received');

            // Exchange authorization code for access token
            const tokenURL = this.buildURL('oauth2/token');

            console.log('Token endpoint:', tokenURL);

            const tokenResponse = await this.request.post(
                tokenURL,
                {
                    form: {
                        grant_type: 'authorization_code',
                        code: code,
                        client_id: this.clientId,
                        redirect_uri: this.redirectURI,
                        code_verifier: codeVerifier
                    }
                }
            );

            if (!tokenResponse.ok()) {
                throw new Error(
                    `Token request failed: ${tokenResponse.status()} - ` +
                    `${await tokenResponse.text()}`
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
            // Close callback server
            if (callbackServer) {
                await new Promise(resolve => {
                    callbackServer.close(resolve);
                });
            }
        }
    }

    // Common authorization headers
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

    // GET employee using internal employee number
    async getEmployee(empNumber) {
        return await this.request.get(
            this.buildURL(`api/v2/pim/employees/${empNumber}`),
            {
                headers: this.getHeaders()
            }
        );
    }

    // GET employee job details
    async getEmployeeJobDetails(empNumber) {
        return await this.request.get(
            this.buildURL(
                `api/v2/pim/employees/${empNumber}/job-details`
            ),
            {
                headers: this.getHeaders()
            }
        );
    }

    // GET employee list
    async getEmployees() {
        return await this.request.get(
            this.buildURL('api/v2/pim/employees'),
            {
                headers: this.getHeaders()
            }
        );
    }
}

module.exports = { APIHelper };
