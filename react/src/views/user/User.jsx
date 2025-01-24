import React, { useState } from 'react'
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

function User() {
    const [view, setView] = useState('editProfile')
    

    return (
        <div className="flex justify-between gap-4 p-4 size-[100%]">
            {/* Left Side: User Profile */}
            <div className="w-1/2 h-[100%] bg-light-mint rounded-xl">
                <UserProfile setView={setView} />
            </div>

            {/* Right Side: Dynamic Content */}
            <div className="w-1/2 bg-light-mint rounded-xl">
                {view === 'editProfile' && <EditProfile />}
                {view === 'changePassword' && <ChangePassword />}
            </div>
        </div>
    )
}

export default User
