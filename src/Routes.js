import Vue from 'vue';
import Router from 'vue-router';
//import auth from "./auth/authService";

import Layout from '@/components/Layout/Layout';
import LandingPage from '@/pages/LandingPage/LandingPage';
import ErrorPage from '@/pages/Error/Error';
// Core
import TransfersPage from '@/pages/Transfers/Transfers';

// Maps
import GoogleMapPage from '@/pages/Maps/Google';

// Main
import Dashboard from '@/pages/Dashboard/Dashboard';
import AccountDetails from '@/pages/Account/AccountDetails';
import CreditCardDetails from '@/pages/Account/CreditCardDetails';

import PayeesPage from '@/pages/Payees/Payees';
import CreatePayeesPage from '@/pages/Payees/CreatePayee';

import SpendingPage from '@/pages/Analytics/Spending';
import CallbackPage from '@/pages/LandingPage/Callback';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
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
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
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
          path: 'spending',
          name: 'SpendingPage',
          component: SpendingPage
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
      ],
    },
  ],
});

//router.beforeEach((to, from, next) => {
  // if (to.path === "/" || to.path === "/callback" || auth.isAuthenticated()) {
  //   return next();
  // }

  //auth.login({ target: to.path });
//});

export default router;