
import auth0 from 'auth0-js';
import EventEmitter from 'events';
import authConfig from '../../auth_config.json';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';

const webAuth = new auth0.WebAuth({
    domain: authConfig.domain,
    redirectUri: `${window.location.origin}/callback`,
    clientID: authConfig.clientId,
    responseType: 'id_token',
    scope: 'openid profile email'
});

class AuthService extends EventEmitter {
    idToken = null;
    profile = null;
    tokenExpiry = null;

    // Starts the user login flow
    login(customState) {
        webAuth.authorize({
            appState: customState
        });
    }

    // Handles the callback request from Auth0
    handleAuthentication() {
        return new Promise((resolve, reject) => {
            webAuth.parseHash((err, authResult) => {
                if (err) {
                    reject(err);
                } else {
                    this.localLogin(authResult);
                    resolve(authResult.idToken);
                }
            });
        });
    }

    localLogin(authResult) {
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;

        // Convert the JWT expiry time from seconds to milliseconds
        this.tokenExpiry = new Date(this.profile.exp * 1000);

        localStorage.setItem(localStorageKey, 'true');

        this.emit(loginEvent, {
            loggedIn: true,
            profile: authResult.idTokenPayload,
            state: authResult.appState || {}
        });
    }

    renewTokens() {
        return new Promise((resolve, reject) => {
            if (localStorage.getItem(localStorageKey) !== "true") {
                return reject("Not logged in");
            }

            webAuth.checkSession({}, (err, authResult) => {
                if (err) {
                    reject(err);
                } else {
                    this.localLogin(authResult);
                    resolve(authResult);
                }
            });
        });
    }

    logout() {
        localStorage.removeItem(localStorageKey);

        this.idToken = null;
        this.tokenExpiry = null;
        this.profile = null;

        webAuth.logout({
            returnTo: window.location.origin
        });

        this.emit(loginEvent, { loggedIn: false });
    }

    isAuthenticated() {
        return (
            Date.now() < this.tokenExpiry &&
            localStorage.getItem(localStorageKey) === 'true'
        );
    }

    authorise(redirectTo, postTo, bank, accountId, extraScopes, consentDuration) {
        if (bank && bank.oidc_config && bank.oidc_config.metadata) {
            const meta = bank.oidc_config.metadata;
            const stateKey = this.getUUID();

            const authState = {
                nonce: stateKey,
                redirectTo: redirectTo,
                bankcode: bank.code,
                accountId: accountId,
                postAuthCodeTo: postTo,
                consent_duration: consentDuration,
                scopes: extraScopes
            };
            localStorage.setItem('auth_state', JSON.stringify(authState));

            var auth_url = meta.authorization_endpoint;
            auth_url = auth_url + "?response_type=code&scope=" + bank.oidc_config.scope + extraScopes;
            auth_url = auth_url + "&client_id=" + bank.oidc_config.client_id;
            auth_url = auth_url + "&redirect_uri=" + bank.oidc_config.redirect_uri;
            auth_url = auth_url + "&state=" + stateKey;

            window.location.href = auth_url;
        }
    }

    getUUID() {
        return Math.random().toString(36).substring(2)
            + (new Date()).getTime().toString(36);
    }
}

export default new AuthService();