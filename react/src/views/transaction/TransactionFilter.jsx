import React, { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function TransactionFilter({ selectedMonth, setSelectedMonth, resetFilters }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // You can track the year state here
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePrevYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  return (
    <div className="bg-light-mint p-[5%] rounded-lg">

      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className='all-center gap-4'>
            <button
            onClick={handlePrevYear}
            className="text-lg text-dark-mint"
            >
            
            <ChevronLeftIcon fontSize="large" />
            </button>
            <span className="text-lg">{currentYear}</span>
            <button
            onClick={handleNextYear}
            className="text-lg text-dark-mint"
            >
            
            <ChevronRightIcon fontSize='large'/>
            </button>
        </div>
        
    
        {/* Reset button */}
        <button onClick={resetFilters} className="text-small underline">
                Reset
            </button>
      </div>

      {/* Month Buttons */}
      <div className="grid grid-cols-4 gap-6">
        {months.map((month, index) => (
          <button
            key={index}
            className={`px-2 py-2 font-semibold rounded-xl ${selectedMonth === index ? "bg-dark-green text-white" : "bg-white"}`}
            onClick={() => setSelectedMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>

      
    </div>
  );
}

export default TransactionFilter;
