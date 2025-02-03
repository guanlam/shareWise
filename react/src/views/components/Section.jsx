import React from 'react'

function Section({ children, className }) {
    return (
        <div className={`w-full sm:w-[40%] h-[100%] rounded-xl ${className}`}>
            {children}
        </div>
    );
}

export default Section
