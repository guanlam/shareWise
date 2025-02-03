import React from 'react'
import CommuteIcon from '@mui/icons-material/Commute';

function TransactionItem({ transaction }){
    return (
      <div className="py-2 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className='size-[2.5rem] bg-slate-500 all-center rounded-full'>
            <span className="text-white"><CommuteIcon /></span> {/* Example icon */}
          </div>
          
          <div>
            <h3 className="font-semibold">{transaction.category}</h3>
            <p className="text-small text-gray-500">{transaction.method} • {transaction.description}</p>
          </div>
        </div>
        <p className={`text-large font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
          {transaction.amount < 0 ? `-RM ${Math.abs(transaction.amount)}` : `RM ${transaction.amount}`}
        </p>
      </div>
    )
}

export default TransactionItem
