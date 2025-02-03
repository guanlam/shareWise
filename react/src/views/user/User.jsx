import React, { useState } from 'react';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Section from '../components/Section';

function User() {
    const [view, setView] = useState('');

    return (
        /* flex-wrap for responsive design*/
        <div className={`flex gap-4 size-[100%] ${view ? 'justify-between' : 'justify-center'} flex-wrap`}>
            {/* Left Side: User Profile */}
            <Section className="bg-light-mint">
                <UserProfile setView={setView} />
            </Section>

            {/* Right Side: Dynamic Content */}
            {view && (
                <Section className="bg-light-mint">
                    {view === 'editProfile' && <EditProfile setView={setView} />}
                    {view === 'changePassword' && <ChangePassword setView={setView} />}
                </Section>
            )}
        </div>
    );
}

export default User;
