import React, { useRef, useState } from 'react'
import pigCoin from '/image/user/pig-coin.png'
import logo from '/image/logo.png'
import gmailIcon from '/image/user/icons8-gmail.png'
import passwordIcon from '/image/user/icons8-password.png'
import accountIcon from '/image/user/icons8-account.png'
import { Link } from 'react-router-dom'
import { useStateContext } from '../../contexts/ContextProvider'
import axiosClient from '../axios-client'

function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken} = useStateContext();

  const onSubmit = (e) => {

    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value
    }
    axiosClient.post('/signup',payload)
      .then(({data}) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 422){
          setErrors(response.data.errors);
        }
      })
    }

  return (
    <div className='view-size rounded-lg all-center'>
      <div className='w-[100%] h-[100%] bg-dark-green rounded-lg all-center flex-col gap-8 p-4 order-2'>
        <img src={pigCoin} alt="Pig Coin" className='w-[20vw] min-w-[150px] max-w-[400px] h-auto scale-x-[-1]'/>
        <h1 className='font-big-title '>Never Too Late to Build Your Future</h1>
      </div>

      <div className='w-[100%] h-[100%] bg-light-cyan rounded-lg all-center'>
        <section className='w-[80%] h-[90%] flex justify-between items-center flex-col '>
          <div className='all-center'>
            <img src={logo} alt="logo shareWise" width="80%" height="100%" />
            
          </div>
          <form className='flex flex-col gap-4 user-form' onSubmit={onSubmit}>

            {
              errors && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {Object.keys(errors).map((key) => (
                  <>
                  <p key={key} className='block sm:inline'>{errors[key][0]}</p>
                  <br />
                  </>
                  
                ))}
              </div>
            }

            <div className={`css-input ${errors && errors.name ? '!border-red-500' : ''}`}>
              <label><img src={accountIcon} alt="" width="30px" height="30px"/></label>
              <input ref={nameRef} type="text" placeholder='Name' />
            </div>

            <div className={`css-input ${errors && errors.email ? '!border-red-500' : ''}`}>
              <label><img src={gmailIcon} alt="" width="30px" height="30px"/></label>
              <input ref={emailRef} type="email" placeholder='Email' />
            </div>

            <div className={`css-input ${errors && errors.password ? '!border-red-500' : ''}`}>
              <label><img src={passwordIcon} alt="" width="30px" height="30px"/></label>
              <input ref={passwordRef} type="password" placeholder='Password' />
            </div>

            <div className={`css-input ${errors && errors.password ? '!border-red-500' : ''}`}>
              <label><img src={passwordIcon} alt="" width="30px" height="30px"/></label>
              <input ref={passwordConfirmationRef} type="password" placeholder='Confirm Password' />
            </div>

            <div className='css-button'>
              <button>Sign up</button>
            </div>
          </form>

          <div className='flex gap-2 whitespace-nowrap text-small'>
            <p className='text-gray-500'>Already have an account?</p>
            <Link to="/login" className='underline font-semibold'>Login</Link>
          </div>
        </section>
        
      </div>
    </div>
  )
}

export default Signup
