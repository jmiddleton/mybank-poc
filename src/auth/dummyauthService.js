import EventEmitter from 'events';

const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';

class AuthService extends EventEmitter {
    idToken = null;
    profile = null;
    tokenExpiry = null;

    // Starts the user login flow
    login(customState) {
        if(customState){
            //window.location= customState.target;
        }else{
            //window.location= '/app/dashboard';
        }
    }

    // Handles the callback request from Auth0
    handleAuthentication() {
        this.localLogin();
        return this.idToken;
    }

    localLogin() {
        this.idToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1rSTBOakJET0VVeU5qSTRSREJFTURWR1JUVTJSREV4TmpsRlEwVXdSVU01UXpFMFFrWTNRZyJ9.eyJuaWNrbmFtZSI6Im15YmFua3Rlc3QiLCJuYW1lIjoibXliYW5rdGVzdEBteWJhbmsuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2Y2OGY0NDA5M2FiZWFjMWEyMjBmNzRlZjdiODdjNzNiP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGbXkucG5nIiwidXBkYXRlZF9hdCI6IjIwMTktMDQtMDJUMTA6Mjg6MDYuODc3WiIsImVtYWlsIjoibXliYW5rdGVzdEBteWJhbmsuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2Rldi1teWJhbmsuYXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVjYTMwZGQ1MDQwOTljMGU0YWVjNDQ3MSIsImF1ZCI6IlIyemJTUUxGdmR5Y0FoUG5Geko2RkNCSmpPRkNRQW84IiwiaWF0IjoxNTU0MjAwODg2LCJleHAiOjE1NTc4MDg1ODYsIm5vbmNlIjoibF9HbzVwbWFSajZSRWZxelFVY1NidGtVbDRrdW1KNnQifQ.lGy6Hl3x-8-AfNBhpe-P1FbgQQUDIr-BRU9xBKPRRMJ_ZbfGdkrMGap2vFZo1dnHimzZN-fKHz3Iq063e1XH2xSmm8NIctKt61AQ71IKybalCNitxvH2xJcK_phyC36p4k_C22k-eAuGL7gNJywoUe-W2MBV3s_pyTafgnxZEjrF3IUpTyY2GgCJeLF6rvlFD3mG4CITiPfYlpEJNeyl21Vt3jLACK-djueHPDgq0M9MA4dMsb35CuJhJkl-R6S6Dv4KKT8fClMFd6oH5rQzdp3kpAU7t5wuntZXQudhzN3ejH9pjDVaSClvpLRusRjld34Eh2CCgEMOuEnfyGjilg";
        this.profile = {
            "nickname": "mybanktest",
            "name": "mybanktest@mybank.com",
            "picture": "https://s.gravatar.com/avatar/f68f44093abeac1a220f74ef7b87c73b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmy.png",
            "updated_at": "2019-04-02T10:28:06.877Z",
            "email": "mybanktest@mybank.com",
            "email_verified": false,
            "iss": "https://dev-mybank.au.auth0.com/",
            "sub": "auth0|5ca30dd504099c0e4aec4471",
            "aud": "R2zbSQLFvdycAhPnFzJ6FCBJjOFCQAo8",
            "iat": 1554200886,
            "exp": 1557808586,
            "nonce": "l_Go5pmaRj6REfqzQUcSbtkUl4kumJ6t"
        };

        // Convert the JWT expiry time from seconds to milliseconds
        this.tokenExpiry = new Date(this.profile.exp * 1000);

        localStorage.setItem(localStorageKey, 'true');

        this.emit(loginEvent, {
            loggedIn: true,
            profile: this.profile,
            state: {}
        });
    }

    renewTokens() {

    }

    logOut() {
        localStorage.removeItem(localStorageKey);

        this.idToken = null;
        this.tokenExpiry = null;
        this.profile = null;

        this.emit(loginEvent, { loggedIn: false });
    }

    isAuthenticated() {
        return (
            Date.now() < this.tokenExpiry &&
            localStorage.getItem(localStorageKey) === 'true'
        );
    }
}

export default new AuthService();