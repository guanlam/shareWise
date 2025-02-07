import React from 'react'

function LoadingEffect() {
  return (
    <div className='w-full h-full bg-opacity-30 flex items-center justify-center'>
        <div className="w-9 h-9 border-4 border-dark-green border-l-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingEffect
