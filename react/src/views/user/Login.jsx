import React, { useRef, useState } from 'react'
import pigCoin from '/image/user/pig-coin.png'
import logo from '/image/logo.png'
import gmailIcon from '/image/user/icons8-gmail.png'
import passwordIcon from '/image/user/icons8-password.png'
import { Link } from 'react-router-dom'
import { useStateContext } from '../../contexts/ContextProvider'
import axiosClient from '../axios-client'


function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken} = useStateContext();

  const onSubmit = (e) => {
    e.preventDefault();

    setErrors(null);
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      
    }
    axiosClient.post('/login',payload)
      .then(({data}) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 422){
          if (response.data.errors){
            setErrors(response.data.errors);
          }else{
            setErrors({
              email: [response.data.message]
            });
          }
          
        }
      })
  }

  return (
    <div className='view-size bg-slate-50 rounded-lg all-center'>
      <div className='w-[100%] h-[100%] bg-dark-green rounded-lg all-center flex-col gap-8 p-4'>
        <img src={pigCoin} alt="Pig Coin" className='w-[20vw] min-w-[150px] max-w-[400px] h-auto'/>
        <h1 className='font-big-title '>Manage Your Money Wisely</h1>
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
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            }

            <div className={`css-input ${errors && errors.email ? '!border-red-500' : ''}`}>
              <label><img src={gmailIcon} alt="" width="30px" height="30px" /></label>
              <input ref={emailRef} type="email" placeholder="Email" />
            </div>

            <div className={`css-input ${errors && errors.password ? '!border-red-500' : ''}`}>
              <label><img src={passwordIcon} alt="" width="30px" height="30px" /></label>
              <input ref={passwordRef} type="password" placeholder="Password" />
            </div>

            <div className='css-button'>
              <button>Login</button>
            </div>
          </form>

          <div className='flex gap-2 whitespace-nowrap text-small'>
            <p className='text-gray-500'>No account?</p>
            <Link to="/signup" className='underline font-semibold'>register now</Link>
          </div>
        </section>
        
      </div>
    </div>
  )
}

export default Login
