import React from 'react';

function CustomButton({ type, onClick, text, className, ...props }) {
  // Define default styles
  const defaultClassName = "px-4 py-2 rounded-3xl text-small font-bold";

  return (
    <button 
      type={type || 'button'} 
      onClick={onClick} 
      className={`${defaultClassName} ${className}`} 
      {...props}
    >
      {text}
    </button>
  );
}

export default CustomButton;
