import authService from './authService';
import dummyAuthService from './dummyauthService';

export default {
    install(Vue) {
        let authRef = process.env.NODE_ENV === 'development' ? dummyAuthService : authService;
        Vue.prototype.$auth = authRef;


        Vue.mixin({
            created() {
                if (this.handleLoginEvent) {
                    authRef.addListener('loginEvent', this.handleLoginEvent);
                }
            },
            destroyed() {
                if (this.handleLoginEvent) {
                    authRef.removeListener('loginEvent', this.handleLoginEvent);
                }
            }
        });
    }
};