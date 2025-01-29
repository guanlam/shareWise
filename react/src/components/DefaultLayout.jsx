import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../views/axios-client';

import logo from '/image/logo.png'
import dashboardIcon from '/image/icons8-dashboard.png'
import transactionIcon from '/image/icons8-transaction.png'
import budgetIcon from '/image/icons8-budget.png'
import increaseIcon from '/image/icons8-increase.png'

function DefaultLayout() {

  const {user,token, notification, setUser, setToken} = useStateContext();

  if (!token){
    return <Navigate to="/login" />
  }


  

  useEffect(() => {
    axiosClient.get('/user').then(({data}) => {
      setUser(data)

    })
  },[])

  return (
    // background div
    <div className='bg-gradient-to-b from-[#c0ebd7] to-[#1c312c] w-full h-screen all-center' >
      {/* main view div */}
      <div className='view-size rounded-lg flex justify-between items-center flex-col gap-4'>
        <header className='w-[100%] h-[10vh] flex justify-between items-center'>
           <img src={logo} alt="logo shareWise" width="250px" height="100%" />
           <div className='all-center gap-1'>
              <p>Hi,</p>
              <Link to="/user" className='underline font-semibold'>
                  {user.name}
              </Link>
              
           </div>
           
        </header >
        <main className='w-[100%] h-[100%] rounded-xl overflow-y-auto'>
              <Outlet />
        </main>
        <footer className='bg-white w-[100%] h-[12vh] rounded-xl'>
          <nav className='w-[100%] h-[100%]'>
            <ul className='flex justify-around items-center w-[100%] h-[100%]'>
              <Link to='/dashboard'>
                <li className='css-nav-li'>
                  <img src={dashboardIcon} alt="dashboard icon" />
                  <p>Dashboard</p>
                </li>
              </Link>
              <Link to='/transaction'>
                <li className='css-nav-li'>
                  <img src={transactionIcon} alt="transaction icon" />
                  <p>Transaction</p>
                </li>
              </Link>

              <Link to='/budget'>
                <li className='css-nav-li-plus'>+</li>
              </Link>

              <Link to='/budget'>
                <li className='css-nav-li'>
                  <img src={budgetIcon} alt="budget icon" />
                  <p>Budget</p>
                </li>
              </Link>

              <Link to='/forecast'>
                <li className='css-nav-li'>
                  <img src={increaseIcon} alt="forecast icon" />
                  <p>Forecast</p>
                </li>
              </Link>
              
              
              
              
              
            </ul>
          </nav>

          
        </footer>
      </div>
      
    </div>
  )
}

export default DefaultLayout
