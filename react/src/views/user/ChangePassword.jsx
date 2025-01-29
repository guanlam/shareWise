import React, { useState } from 'react';
import axiosClient from '../axios-client'; // Import your Axios instance
import passwordIcon from '/image/user/icons8-password.png';
import LoadingEffect from '../components/LoadingEffect2';
import { useStateContext } from '../../contexts/ContextProvider';
import Notification from '../components/Notification';

function ChangePassword({ setView }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState(null);
  const {setUser,notification, setNotification} = useStateContext();
  const [loading,setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient
      .put('/user-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
      .then((res) => {
        setNotification(res.data.message);
        setErrors(null);
        setLoading(false);

        // Reset the input fields after success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Refresh user data after successful update
        axiosClient.get('/user').then(({ data }) => {
          setUser(data); // Update the user context
        });
        
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
          setLoading(false);
          
        }
      });
  };

  return (
    <div className="p-6 rounded-lg size-[100%]">
      <form className="user-form flex justify-between flex-col size-[100%]" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg mb-4">Change Password</h2>

          {errors && <Notification message={Object.values(errors).flat().join(', ')} type="error" />}
          {notification && <Notification message={notification} type="success" />}

          <div className={`css-input ${errors && errors.currentPassword ? '!border-red-500' : ''}`}>
            <label>
              <img src={passwordIcon} alt="" width="30px" height="30px" />
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className={`css-input ${errors && errors.newPassword ? '!border-red-500' : ''}`}>
            <label>
              <img src={passwordIcon} alt="" width="30px" height="30px" />
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={`css-input ${errors && errors.newPassword ? '!border-red-500' : ''}`}>
            <label>
              <img src={passwordIcon} alt="" width="30px" height="30px" />
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          <button
            type="reset"
            className="bg-white text-black px-4 py-2 rounded-3xl text-small font-bold"
            onClick={() => setView('')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-dark-green text-white px-4 py-2 rounded-3xl text-small font-bold"
          >
            Confirm
          </button>
        </div>
      </form>
      {loading && <LoadingEffect /> }
    </div>
  );
}

export default ChangePassword;
