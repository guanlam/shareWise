import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FoodnDrinkIcon from '@mui/icons-material/Fastfood';

function PaymentMethod() {
  return (
    <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
      <section className='space-y-4 size-full flex flex-col'>
        <div className="flex justify-between items-center">
            <h2 className='text-medium font-semibold'>Payment Method</h2>
        <SettingsOutlinedIcon fontSize="large" />
        </div>

        <div className='grid grid-cols-2 gap-8 h-[45vh] overflow-auto scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-slate-50 pr-2'>
            {/* scrollbar */}
            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>

            <div className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl'>
                <div className='bg-amber-300 rounded-xl p-2 text-white'>
                    <FoodnDrinkIcon/>
                </div>
                <p className='text-small'>
                   Food & Drink 
                </p>
            </div>
            
        
        </div>
      </section>
        
        
    
    </div>
  )
}

export default PaymentMethod
