import React from 'react';

function ProgressBar(props) {
    const { bgcolor, completed } = props;

    // Limit the width to a max of 100%
    const progressWidth = Math.min(completed, 100);  // Ensure the width doesn't exceed 100%

    return (
        <div className="relative w-full h-4 bg-white rounded-xl">
            {/* Set width to max 100%, display percentage can exceed 100% */}
            <div 
                className="h-4 rounded-xl" 
                style={{
                    width: `${progressWidth}%`,  // Max 100% for the progress bar width
                    backgroundColor: bgcolor, // Dynamically set the background color
                }}
            ></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-black text-xs font-semibold">
                {completed.toFixed(2)}%  {/* Show the actual completed percentage */}
            </div>
        </div>
    );
}

export default ProgressBar;
