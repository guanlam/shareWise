import React, { useState } from 'react'
import Section from '../../components/Section'
import TransactionDetail from './TransactionDetail'



function AddTransaction() {
    const [transaction, setTransaction] = useState({
        amount: 0,
        category: "Food & Drink",
        method: "Debit Card",
        date: new Date().toISOString().split("T")[0],
        recurrence: "None",
    });
    return (
        <div className="flex gap-4 size-[100%] justify-between flex-wrap">
                {/* Left Side: Balance Summary & Transaction Filter */}
                <Section className="flex flex-col gap-4 p-4 bg-light-mint">
                    {/* Left Panel - Transaction Details */}
                    <TransactionDetail transaction={transaction} setTransaction={setTransaction} />
                </Section>

                {/* Right Side: Transaction List */}
                <Section className="flex flex-col gap-4 p-4 bg-light-mint">
                    <h2>bye</h2>
                </Section>


        </div>
    )
}

export default AddTransaction
