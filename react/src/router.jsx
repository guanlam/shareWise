import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './views/user/Login';
import Signup from './views/user/Signup';
import DefaultLayout from './components/DefaultLayout';
import GuestLayout from './components/GuestLayout';
import NotFound from './views/NotFound';
import User from './views/user/User';
import Transaction from './views/transaction/Transaction';
import AddTransaction from './views/transaction/addTransaction/AddTransaction';
import ExpenseByCategory from './views/dashboard/ExpenseByCategory';
import Dashboard from './views/dashboard/Dashboard';
import Budget from './views/budget/Budget';
import Forecast from './views/aiForecast/Forecast';




const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children:[
            
            {
                path: '/user',
                element: <User />
            },
            {
                path: '/transaction',
                element: <Transaction />
            },
            {
                path: '/addTransaction',
                element: <AddTransaction />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/budget',
                element: <Budget />
            },
            {
                path: '/forecast',
                element: <Forecast />
            },
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children:[
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])



export default router;
