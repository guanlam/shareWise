import React from 'react'

function LoadingEffect2() {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-slate-100 bg-opacity-30 flex items-center justify-center'>
        <div className="w-9 h-9 border-4 border-dark-green border-l-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingEffect2
