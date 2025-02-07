import React, { useState, useEffect } from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import axiosClient from '../../axios-client';
import iconMappings from "../../icon-mappings"; // Import your icon mapping
import LoadingEffect from '../../components/LoadingEffect';

function PaymentMethod() {
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    axiosClient.get(`/payment-methods`)
    .then((res) => {
        setAllCategories(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
    
  
    return (
      <>
        <div className="bg-light-cyan rounded-xl p-6 size-full flex flex-col justify-between">
          { loading ? <LoadingEffect/> :
            <section className='space-y-4 size-full flex flex-col'>
              <div className="flex justify-between items-center">
                <h2 className='text-medium font-semibold'>Payment Method</h2>
                <SettingsOutlinedIcon fontSize="large" />
              </div>
              
              {/* Scrollable Category List */}
              <div className='grid grid-cols-2 gap-8 max-h-[45vh] overflow-auto scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-slate-50 pr-2'>
                {allCategories.map((category) => (
                  <div
                    key={category.id}
                    className='border border-gray-300 all-center gap-4 px-4 py-2 rounded-xl text-center '
                  >
                    <div className='bg-amber-300 rounded-xl p-2 text-white '>
                      {(() => {
                        // Look up the icon component using the icon name from the category.
                        const IconComponent = iconMappings[category.icon] || iconMappings["Default"];
                        return <IconComponent />;
                      })()}
                    </div>
                    <p className='text-small flex-1'>
                      {category.name}
                    </p>
                  </div>
                ))}
      
      
              </div>
            </section>
          }
          
        </div>
      </>
      
  )
}

export default PaymentMethod
