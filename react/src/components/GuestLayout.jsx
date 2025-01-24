import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';


function GuestLayout() {
  const {token} = useStateContext();
  if (token){
    return <Navigate to="/" />
  }

  return (
    <main className='bg-gradient-to-b from-[#c0ebd7] to-[#1c312c] w-full h-screen all-center'>
      <Outlet />
    </main>
      
  )
}

export default GuestLayout
