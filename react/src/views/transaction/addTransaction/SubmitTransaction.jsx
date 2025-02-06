import React from 'react'

function SubmitTransaction() {
  return (
    <div className='flex justify-between items-center'>
      <button className='border border-black w-[30%] p-4 rounded-md uppercase'>Cancel</button>
      <button className='bg-dark-green text-white w-[30%] p-4 rounded-md uppercase'>Save</button>
    </div>
  )
}

export default SubmitTransaction
