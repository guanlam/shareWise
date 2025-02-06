import React, { useState } from 'react'
import Section from '../../components/Section'
import TransactionDetail from './TransactionDetail'
import Calculator from './Calculator';
import SubmitTransaction from './SubmitTransaction';
import Category from './Category';
import PaymentMethod from './PaymentMethod';



function AddTransaction() {
    const [transaction, setTransaction] = useState({
        amount: 0,
        category: "Food & Drink",
        method: "Debit Card",
        date: new Date().toISOString().split("T")[0],
        recurrence: "None",
    });

    const [activePanel, setActivePanel] = useState("calculator");

    return (
        <div className="flex gap-4 size-full justify-between flex-wrap">
                {/* Left Side: Balance Summary & Transaction Filter */}
                <Section className="flex flex-col gap-4 p-4 bg-light-mint">
                    {/* Left Panel - Transaction Details */}
                    <TransactionDetail transaction={transaction} setTransaction={setTransaction} setActivePanel={setActivePanel} />
                </Section>

                {/* Right Side: Transaction List */}
                <Section className="flex flex-col justify-between gap-8">
                    
                    <SubmitTransaction />
                    {
                        activePanel === "calculator" ? (
                            <Calculator
                            transaction={transaction}
                            setTransaction={setTransaction}
                            setActivePanel={setActivePanel}
                            />
                        ) : activePanel === "paymentMethod" ? (
                            <PaymentMethod />
                        ) : activePanel === "category" ? (
                            <Category />
                        ) : null
                    }
                </Section>


        </div>
    )
}

export default AddTransaction
