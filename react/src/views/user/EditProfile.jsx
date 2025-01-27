import React, { useEffect, useState } from 'react';
import gmailIcon from '/image/user/icons8-gmail.png'
import accountIcon from '/image/user/icons8-account.png'
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../axios-client'

function EditProfile({setView}) {
  const {user} = useStateContext();
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);


  const [userProfile, setUserProfie] = useState({
      id: user.id,
      name: user.name,
      email: user.email,
  });

 

  const onSubmit = (e) => {
      e.preventDefault();

      if (userProfile.id){
          axiosClient.put(`/user-profile/${userProfile.id}`, userProfile).then((res) => {
              //TODO show notification
              
              setSuccess(res.data.message);
              console.log(success);

          }).catch((error) => {
              const response = error.response;
              if (response && response.status === 422){
                setErrors(response.data.errors);
              }
            })
      }
      }
  

  return (
    <div className="p-6 rounded-lg size-[100%]">
      
      <form className='user-form flex justify-between flex-col size-[100%]'>
      
        <div className='flex flex-col gap-4'>
          <h2 className="font-bold text-lg mb-4">Edit Profile</h2>

          {
              errors && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
          }
          {success && (
            <div className={`css-input ${success ? '!border-green-500' : ''}`}>
              <p>{success}</p>
            </div>
          )}


          
          <div className={`css-input ${errors && errors.name ? '!border-red-500' : ''}`}>
            <label><img src={accountIcon} alt="account icon" width="30px" height="30px" /></label>
                          <input onChange={ev => setUserProfie({...userProfile,name: ev.target.value})} type="text" value={userProfile.name} />
          </div>
          <div className={`css-input ${errors && errors.email ? '!border-red-500' : ''}`}>
            <label><img src={gmailIcon} alt="gmail icon" width="30px" height="30px" /></label>
                          <input onChange={ev => setUserProfie({...userProfile,email: ev.target.value})} type="email" value={userProfile.email} />
          </div>
        </div>
        
        <div className='flex justify-end items-center gap-4'>
          <button type="reset" className="bg-white text-black px-4 py-2 rounded-3xl text-small font-bold" onClick={() => setView('')}>Cancel</button>
          <button type="submit" className="bg-dark-green text-white px-4 py-2 rounded-3xl text-small font-bold" onClick={onSubmit}>Confirm</button>
        </div>
        
      </form>
    </div>
  );
}

export default EditProfile;
