import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
//import auth from "./auth/authService";

import Layout from '@/components/Layout/Layout';
import ErrorPage from '@/pages/Error/Error';
// Core
import TransfersPage from '@/pages/Transfers/Transfers';

// Maps
import GoogleMapPage from '@/pages/Maps/Google';

// Main
import Accounts from '@/pages/Accounts/Accounts';
import AccountDetails from '@/pages/AccountDetails/AccountDetails';
import CreditCardDetails from '@/pages/AccountDetails/CreditCardDetails';
import TermDepositDetails from '@/pages/AccountDetails/TermDepositDetails';
import UnlinkAccountPage from '@/pages/AccountDetails/UnlinkAccount';
import LoanDetails from '@/pages/AccountDetails/LoanDetails';

import PayeesPage from '@/pages/Payees/Payees';
import CreatePayeesPage from '@/pages/Payees/CreatePayee';

import DashboardPage from '@/pages/Dashboard/Dashboard';
import CallbackPage from '@/pages/LandingPage/Callback';
import BankCallbackPage from '@/pages/LandingPage/BankCallback';
import ProfilePage from '@/pages/Profile/Profile';
import NotificationsPage from '@/pages/Notifications/Notifications';

import AppHeader from "@/components/Layout/AppHeader";
import AppFooter from "@/components/Layout/AppFooter";
import Landing from "@/pages/LandingPage/Landing";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "LandingPage",
      components: {
        header: AppHeader,
        default: Landing,
        footer: AppFooter
      }
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackPage
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'bankcallback',
          name: 'bankcallback',
          component: BankCallbackPage
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: DashboardPage,
        },{
          path: 'accounts',
          name: 'Accounts',
          component: Accounts,
        },
        {
          path: 'accounts/:accountId',
          name: 'AccountDetails',
          component: AccountDetails,
        },
        {
          path: 'creditcards/:accountId',
          name: 'CreditCardDetails',
          component: CreditCardDetails,
        },
        {
          path: 'termdeposits/:accountId',
          name: 'TermDepositDetails',
          component: TermDepositDetails,
        },
        {
          path: 'loans/:accountId',
          name: 'LoanDetails',
          component: LoanDetails,
        },
        {
          path: 'unlink/:accountId',
          name: 'UnlinkAccount',
          component: UnlinkAccountPage
        },
        {
          path: 'transfers/:accountId',
          name: 'TransfersPage',
          component: TransfersPage,
        },
        {
          path: 'transfers',
          name: 'TransfersNewPage',
          component: TransfersPage,
        },
        {
          path: 'payees',
          name: 'PayeesPage',
          component: PayeesPage,
        },
        {
          path: 'payees/:payeeId',
          name: 'CreatePayees',
          component: CreatePayeesPage,
        },
        {
          path: 'branches',
          name: 'GoogleMapPage',
          component: GoogleMapPage,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfilePage,
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: NotificationsPage,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
  }
  if (to.path === "/" || to.path === "/callback" || Vue.prototype.$auth.isAuthenticated()) {
    return next();
  }

  Vue.prototype.$auth.login({ target: to.path, query: to.query });
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done();
})

export default router;