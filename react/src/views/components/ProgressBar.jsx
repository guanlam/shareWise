import React from 'react';

function ProgressBar(props) {
    const { bgcolor, completed } = props;

    return (
        <div className="relative w-full h-4 bg-white rounded-xl">
            {/* Combine className (for static styles) and inline style (for dynamic styles) */}
            <div 
                className="h-4 rounded-xl" 
                style={{
                    width: `${completed}%`,  // Dynamically set the width based on `completed`
                    backgroundColor: bgcolor, // Dynamically set the background color based on `bgcolor`
                }}
            ></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-black text-xs font-semibold">
                {completed.toFixed(2)}%
            </div>
        </div>
    );
}

export default ProgressBar;
