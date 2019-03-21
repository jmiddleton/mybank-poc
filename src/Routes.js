import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Login from '@/pages/Login/Login';
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

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
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
          name:'SpendingPage',
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
