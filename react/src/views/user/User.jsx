import React, { useState } from 'react'
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

function User() {
    const [view, setView] = useState('')
    

    return (
        <div className={`flex gap-4 size-[100%] ${view ? 'justify-between' : 'justify-center'}`}>
            {/* Left Side: User Profile */}
            <div className="w-[40%] h-[100%] bg-light-mint rounded-xl">
                <UserProfile setView={setView} />
            </div>

            {/* Right Side: Dynamic Content */}
            {view && 
                <div className="w-[40%] bg-light-mint rounded-xl">
                    {view === 'editProfile' && <EditProfile setView={setView} />}
                    {view === 'changePassword' && <ChangePassword setView={setView} />}
                </div> 
            }
            
        </div>
    )
}

export default User
