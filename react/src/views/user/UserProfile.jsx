import React from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { SlArrowRight } from "react-icons/sl";
import { RxAvatar } from "react-icons/rx";
import passwordIcon from '/image/user/icons8-password-user.png';
import axiosClient from '../axios-client';

function UserProfile({ setView }) {
    const {user, setUser,setToken} = useStateContext();
    const onLogout = (e) => {
            e.preventDefault();
    
            axiosClient.post('/logout').then(() => {
                setUser({});
                setToken(null)
            })
        }
    const onDelete = (u) => {
        if (!window.confirm('Are you sure you want to delete this user?')){
            return;
            }
    
        axiosClient.delete(`/user-delete/${user.id}`).then(() => {
            setUser({});
            setToken(null);
            
        })
        }

    return (
        <div className="size-[100%] p-6 rounded-lg flex justify-between flex-col">
            <div>
            <h2 className="font-bold text-lg mb-4">Your Profile</h2>

                <div className='flex justify-between items-center mb-4'>
                    <div className="flex items-center gap-4">
                        <div className='text-[3rem]'><RxAvatar /></div>
                        <div className='flex justify-center flex-col'>
                            <p>Name: {user.name}</p>
                            <p>ID: {user.id}</p> 
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={() => setView('editProfile')} className="text-medium">
                            <SlArrowRight />
                        </button>
                    </div>
                </div>
                {/* line */}
                <div className='w-[100%] h-[3px] bg-light-gray'></div>


                <div className="mt-8">
                    <div className='flex justify-between'>
                        <div className='all-center gap-4 pl-2'>
                            <img src={passwordIcon} alt="password icon" width="35px" height="35px" />
                            <p className='text-small font-bold'>Change Password</p>
                        </div>
                        
                        <button onClick={() => setView('changePassword')} className="text-medium">
                            <SlArrowRight />
                        </button>
                    </div>


                    
                </div>
            </div>
            

            <div className='all-center flex-col'>
                <button className="block mb-2 text-small font-semibold underline" onClick={onLogout}>Log Out</button>
                <button className="block text-small font-semibold text-red-500" onClick={onDelete}>Delete Account</button>
            </div>
        </div>
    );
}

export default UserProfile;
