import authService from './authService';
import dummyAuthService from './dummyauthService';

export default {
    install(Vue) {
        let authRef = process.env.NODE_ENV === 'developmentc' ? dummyAuthService : authService;
        Vue.prototype.$auth = authRef;


        Vue.mixin({
            created() {
                if (this.handleLoginEvent) {
                    authRef.addListener('loginEvent', this.handleLoginEvent);
                }
                if (this.handleNetworkError) {
                    authRef.addListener('networkError', this.handleNetworkError);
                }
            },
            destroyed() {
                if (this.handleLoginEvent) {
                    authRef.removeListener('loginEvent', this.handleLoginEvent);
                }
                if (this.handleNetworkError) {
                    authRef.removeListener('networkError', this.handleNetworkError);
                }
            }
        });
    }
};