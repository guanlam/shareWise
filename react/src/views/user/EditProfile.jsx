import React, { useEffect, useState } from 'react';
import gmailIcon from '/image/user/icons8-gmail.png'
import accountIcon from '/image/user/icons8-account.png'
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../axios-client'
import LoadingEffect from '../components/LoadingEffect2';
import Notification from '../components/Notification';
import CustomButton from '../components/CustomButton';

function EditProfile({setView}) {
  const {user, setUser,notification,setNotification} = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading,setLoading] = useState(false);



  const [userProfile, setUserProfie] = useState({
      id: user.id,
      name: user.name,
      email: user.email,
  });


  const onSubmit = (e) => {
      e.preventDefault();

      if (userProfile.id){
          setLoading(true);
          axiosClient.put(`/user-profile/${userProfile.id}`, userProfile).then((res) => {
              // show notification
              setNotification(res.data.message);
              setErrors('');
              setLoading(false);
              

              // Refresh user data after successful update
              axiosClient.get('/user').then(({ data }) => {
                setUser(data); // Update the user context
              });
          }).catch((error) => {
              const response = error.response;
              if (response && response.status === 422){
                setErrors(response.data.errors);
                setLoading(false);
              }
            })

      }
      
      }
  

  return (
    <div className="p-6 rounded-lg size-[100%]">
      
      <form className='user-form flex justify-between flex-col size-[100%]' onSubmit={onSubmit}>
      
        <div className='flex flex-col gap-4'>
          <h2 className="font-bold text-lg mb-4">Edit Profile</h2>

          {errors && <Notification message={Object.values(errors).flat().join(', ')} type="error" />}
          {notification && <Notification message={notification} type="success" />}


          
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
          {/* Cancel Button */}
          <CustomButton
            type="reset"
            className="bg-white text-black"
            text="Cancel"
            onClick={() => setView('')}
          />

          {/* Confirm Button */}
          <CustomButton
            type="submit"
            className="bg-dark-green text-white"
            text="Confirm"
            
          />
          
        </div>
        
        
      </form>

      {loading && <LoadingEffect /> }
    </div>
  );
}

export default EditProfile;
