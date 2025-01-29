import React from 'react'

function TransactionItem({ transaction }){
    return (
      <div className="py-2 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-large">🍽️</span> {/* Example icon */}
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
