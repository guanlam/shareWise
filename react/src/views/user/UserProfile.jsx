import React from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

function UserProfile({ setView }) {
    const {user} = useStateContext();
    const onLogout = (e) => {
            e.preventDefault();
    
            axiosClient.post('/logout').then(() => {
                setUser({});
                setToken(null)
            })
        }
    return (
        <div className="p-6 rounded-lg">
            <h2 className="font-bold text-lg mb-4">Your Profile</h2>

            <div className='flex justify-between items-center mb-4'>
                <div className="flex gap-4">
                    <img className="inline-block size-16 rounded-full" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                    <div className='flex justify-center flex-col'>
                        <p>Name: {user.name}</p>
                        <p>ID: {user.id}</p> 
                    </div>
                </div>
                
                <div>
                    <p>I</p>
                </div>
            </div>

            <div className='w-[100%] h-[3px] bg-gray-300'></div>
            

            <div className="mt-4">
                <button onClick={() => setView('editProfile')} className="block mb-2">
                Edit Profile
                </button>
                <button onClick={() => setView('changePassword')} className="block mb-2">
                Change Password
                </button>
                <button className="block mb-2">Log Out</button>
                <button className="block text-red-500">Delete Account</button>
            </div>
        </div>
    );
}

export default UserProfile;
