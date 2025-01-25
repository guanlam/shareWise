import React from 'react';
import gmailIcon from '/image/user/icons8-gmail.png'
import accountIcon from '/image/user/icons8-account.png'
import { useStateContext } from '../../contexts/ContextProvider';

function EditProfile({setView}) {
  const {user} = useStateContext();
  return (
    <div className="p-6 rounded-lg size-[100%]">
      
      <form className='user-form flex justify-between flex-col size-[100%]'>
      
        <div className='flex flex-col gap-4'>
          <h2 className="font-bold text-lg mb-4">Edit Profile</h2>
          <div className="css-input">
            <label><img src={accountIcon} alt="account icon" width="30px" height="30px" /></label>
                          <input type="text" placeholder={user.name} />
          </div>
          <div className="css-input">
            <label><img src={gmailIcon} alt="gmail icon" width="30px" height="30px" /></label>
                          <input type="email" placeholder={user.email} />
          </div>
        </div>
        
        <div className='flex justify-end items-center gap-4'>
          <button type="reset" className="bg-white text-black px-4 py-2 rounded-3xl text-small font-bold" onClick={() => setView('')}>Cancel</button>
          <button type="submit" className="bg-dark-green text-white px-4 py-2 rounded-3xl text-small font-bold">Confirm</button>
        </div>
        
      </form>
    </div>
  );
}

export default EditProfile;
